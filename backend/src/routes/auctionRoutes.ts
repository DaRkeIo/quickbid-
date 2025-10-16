import express, { Request, Response } from 'express';
import { Auction } from '../models/Auction';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();
router.get('/my-auctions', protect, async (req, res) => {
    try {
      console.log('req.user:', req.user); // Add this line
      const userId = req.user?._id;
      if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }
      const myAuctions = await Auction.find({ seller: userId });
      res.json(myAuctions);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching your auctions' });
    }
  });

// Get all auctions
router.get('/', async (_req: Request, res: Response) => {
    try {
        const auctions = await Auction.find({});
        return res.json(auctions);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching auctions' });
    }
});

// Create a new auction
router.post('/', protect, async (req: Request, res: Response) => {
    try {
        const auction = new Auction({
            ...req.body,
            seller: req.user._id,
        });
        await auction.save();
        return res.status(201).json(auction);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error creating auction';
        return res.status(400).json({ message });
    }
});

// Get single auction
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const auction = await Auction.findById(req.params.id);
        if (!auction) {
            return res.status(404).json({ message: 'Auction not found' });
        }
        return res.json(auction);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching auction' });
    }
});

// Get auctions created by the logged-in user
router.get('/my-auctions', protect, async (req, res) => {
  try {
    // @ts-ignore
    const userId = req.user._id; // protect middleware should set req.user
    const myAuctions = await Auction.find({ seller: userId });
    res.json(myAuctions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching your auctions' });
  }
});

// Update auction
router.put('/:id', protect, async (req: Request, res: Response) => {
    try {
        const auction = await Auction.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!auction) {
            return res.status(404).json({ message: 'Auction not found' });
        }
        return res.json(auction);
    } catch (error) {
        return res.status(400).json({ message: 'Error updating auction' });
    }
});

// Delete auction
router.delete('/:id', protect, async (req: Request, res: Response) => {
    try {
        const auction = await Auction.findByIdAndDelete(req.params.id);
        if (!auction) {
            return res.status(404).json({ message: 'Auction not found' });
        }
        return res.json({ message: 'Auction deleted' });
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting auction' });
    }
});

export default router;
