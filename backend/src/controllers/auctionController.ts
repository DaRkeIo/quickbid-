import { Request, Response } from 'express';
import { Auction } from '../models/Auction';
import { Bid } from '../models/Bid';

export const createAuction = async (req: Request, res: Response) => {
  try {
    const { title, description, imageUrl, startingBid, endsAt } = req.body;
    const seller = req.user._id;

    // Validate auction parameters
    if (new Date(endsAt) <= new Date()) {
      return res.status(400).json({ error: 'End time must be in the future' });
    }

    const auction = new Auction({
      title,
      description,
      imageUrl,
      startingBid,
      currentBid: startingBid,
      seller,
      endsAt,
    });

    await auction.save();
    return res.status(201).json({
      success: true,
      auction,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create auction' });
  }
};

export const getAuctions = async (_req: Request, res: Response) => {
  try {
    const auctions = await Auction.find()
      .populate('seller', 'email name')
      .populate('highestBidder', 'email name')
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      auctions,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch auctions' });
  }
};

export const getAuction = async (req: Request, res: Response) => {
  try {
    const auction = await Auction.findById(req.params.id)
      .populate('seller', 'email name')
      .populate('highestBidder', 'email name');

    if (!auction) {
      return res.status(404).json({ error: 'Auction not found' });
    }

    // Get bid history
    const bids = await Bid.find({ auction: auction._id })
      .populate('bidder', 'email name')
      .sort({ createdAt: 1 });

    return res.json({
      success: true,
      auction,
      bids,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch auction' });
  }
};

export const updateAuction = async (req: Request, res: Response) => {
  try {
    const auction = await Auction.findById(req.params.id);
    if (!auction) {
      return res.status(404).json({ error: 'Auction not found' });
    }

    // Only seller can update auction
    if (auction.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const { title, description, imageUrl, endsAt } = req.body;

    // Update auction fields
    if (title) auction.title = title;
    if (description) auction.description = description;
    if (imageUrl) auction.imageUrl = imageUrl;
    if (endsAt) {
      auction.endsAt = new Date(endsAt);
      if (new Date(endsAt) <= new Date()) {
        return res.status(400).json({ error: 'End time must be in the future' });
      }
    }

    await auction.save();
    return res.json({
      success: true,
      auction,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update auction' });
  }
};

export const deleteAuction = async (req: Request, res: Response) => {
  try {
    const auction = await Auction.findById(req.params.id);
    if (!auction) {
      return res.status(404).json({ error: 'Auction not found' });
    }

    // Only seller can delete auction
    if (auction.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Delete associated bids
    await Bid.deleteMany({ auction: auction._id });

    await auction.deleteOne();
    return res.json({
      success: true,
      message: 'Auction deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete auction' });
  }
};
