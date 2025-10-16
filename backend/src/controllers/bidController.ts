import { Request, Response } from 'express';
import { Auction } from '../models/Auction';
import { Bid } from '../models/Bid';

export const placeBid = async (req: Request, res: Response) => {
  try {
    const { amount } = req.body;
    const auctionId = req.params.id;
    const bidder = req.user._id;

    // Check if auction exists
    const auction = await Auction.findById(auctionId);
    if (!auction) {
      return res.status(404).json({ error: 'Auction not found' });
    }

    // Validate bid amount
    if (amount <= auction.currentBid) {
      return res.status(400).json({ error: 'Bid must be higher than current bid' });
    }

    // Check if auction is still active
    if (auction.status !== 'active') {
      return res.status(400).json({ error: 'Auction has ended' });
    }

    // Create new bid
    const bid = new Bid({
      auction: auction._id,
      bidder,
      amount,
    });

    // Update auction with new bid
    auction.currentBid = amount;
    auction.highestBidder = bidder;
    await Promise.all([bid.save(), auction.save()]);

    // Update previous highest bid status
    if (auction.highestBidder) {
      await Bid.findOneAndUpdate(
        { auction: auction._id, bidder: auction.highestBidder },
        { status: 'outbid' }
      );
    }

    return res.json({
      success: true,
      bid,
      auction,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to place bid' });
  }
};

export const getBidHistory = async (req: Request, res: Response) => {
  try {
    const auctionId = req.params.id;
    const bids = await Bid.find({ auction: auctionId })
      .populate('bidder', 'email name')
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      bids,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bid history' });
  }
};

export const getUserBids = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const bids = await Bid.find({ bidder: userId })
      .populate('auction', 'title currentBid')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      bids,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user bids' });
  }
};
