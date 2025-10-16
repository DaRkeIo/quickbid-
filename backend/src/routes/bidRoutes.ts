import express from 'express';
import { Request, Response } from 'express';
import { Bid } from '../models/Bid';
import { Auction } from '../models/Auction';

const router = express.Router();

// Get all bids
router.get('/', async (_req: Request, res: Response) => {
    try {
        const bids = await Bid.find();
        return res.json(bids);
    } catch (error: unknown) {
        return res.status(500).json({ 
            message: error instanceof Error ? error.message : 'An unexpected error occurred' 
        });
    }
});

// Get single bid
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const bid = await Bid.findById(req.params.id);
        if (!bid) {
            return res.status(404).json({ message: 'Bid not found' });
        }
        return res.json(bid);
    } catch (error: unknown) {
        return res.status(500).json({ 
            message: error instanceof Error ? error.message : 'An unexpected error occurred' 
        });
    }
});

// Create new bid
router.post('/', async (req: Request, res: Response) => {
    try {
        const bid = new Bid({
            ...req.body
        });
        const newBid = await bid.save();
        return res.status(201).json(newBid);
    } catch (error: unknown) {
        return res.status(500).json({ 
            message: error instanceof Error ? error.message : 'An unexpected error occurred' 
        });
    }
});
// Update bid
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const bid = await Bid.findById(req.params.id);
        if (!bid) {
            return res.status(404).json({ message: 'Bid not found' });
        }
        
        bid.set(req.body);
        const updatedBid = await bid.save();
        return res.json(updatedBid);
    } catch (error: unknown) {
        return res.status(500).json({ 
            message: error instanceof Error ? error.message : 'An unexpected error occurred' 
        });
    } });

// Delete bid
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const bid = await Bid.findById(req.params.id);
        if (!bid) {
            return res.status(404).json({ message: 'Bid not found' });
        }
        
        await Bid.deleteOne({ _id: bid._id });
        return res.json({ message: 'Bid deleted' });
    } catch (error: unknown) {
        return res.status(500).json({ 
            message: error instanceof Error ? error.message : 'An unexpected error occurred' 
        });
    }
});

// Get all bids for a specific auction
router.get('/auction/:auctionId', async (req: Request, res: Response) => {
    try {
        const auctionId = req.params.auctionId;
        const bids = await Bid.find({ auction: auctionId })
            .populate('bidder', 'name email')
            .sort({ createdAt: -1 });
        return res.json(bids);
    } catch (error: unknown) {
        return res.status(500).json({ 
            message: error instanceof Error ? error.message : 'An unexpected error occurred' 
        });
    }
});

// Create bid for a specific auction
router.post('/auction/:auctionId', async (req: Request, res: Response) => {
    try {
        const auctionId = req.params.auctionId;
        const auction = await Auction.findById(auctionId);
        
        if (!auction) {
            return res.status(404).json({ message: 'Auction not found' });
        }

        // Check if auction is active
        const now = new Date();
        if (auction.status === 'ended' || now > auction.endsAt) {
            return res.status(400).json({ message: 'Auction is not active' });
        }

        const bidAmount = Number(req.body.amount);
        if (bidAmount <= auction.currentBid) {
            return res.status(400).json({ message: 'Bid must be higher than current bid' });
        }

        const bid = new Bid({
            auction: auctionId,
            bidder: req.body.userId,
            amount: bidAmount
        });

        const newBid = await bid.save();

        // Update auction's current bid and highest bidder
        auction.currentBid = bidAmount;
        auction.highestBidder = req.body.userId;
        await auction.save();

        return res.status(201).json(newBid);
    } catch (error: unknown) {
        return res.status(500).json({ 
            message: error instanceof Error ? error.message : 'An unexpected error occurred' 
        });
    }
});

// Delete bid from auction
router.delete('/auction/:auctionId/:bidId', async (req: Request, res: Response) => {
    try {
        const { auctionId, bidId } = req.params;
        const bid = await Bid.findById(bidId);
        
        if (!bid) {
            return res.status(404).json({ message: 'Bid not found' });
        }

        if (bid.auction.toString() !== auctionId) {
            return res.status(400).json({ message: 'Bid does not belong to this auction' });
        }

        await Bid.deleteOne({ _id: bidId });

        // Update auction's current bid and highest bidder if needed
        const auction = await Auction.findById(auctionId);
        if (!auction) {
            return res.status(404).json({ message: 'Auction not found' });
        }

        // Find the next highest bid
        const nextBid = await Bid.findOne({ auction: auctionId })
            .sort({ amount: -1 })
            .select('amount bidder');

        if (nextBid) {
            auction.currentBid = nextBid.amount;
            auction.highestBidder = nextBid.bidder;
            await auction.save();
        } else {
            // Reset auction if no more bids
            auction.currentBid = auction.startingBid;
            auction.highestBidder = null;
            await auction.save();
        }

        return res.json({ message: 'Bid deleted successfully' });
    } catch (error: unknown) {
        return res.status(500).json({ 
            message: error instanceof Error ? error.message : 'An unexpected error occurred' 
        });
    }
});

export default router;
