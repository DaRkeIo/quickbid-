import { Auction, IAuction } from '../models/Auction';
import { Document, Types } from 'mongoose';
import { Bid } from '../models/Bid';
import { Server } from 'socket.io';

export class AuctionService {
  static async handleNewBid(io: Server, auctionId: string, bid: Document & {
    auction: Types.ObjectId;
    amount: number;
    bidder: Types.ObjectId;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    try {
      const auction = await Auction.findById(new Types.ObjectId(auctionId));
      if (!auction) {
        throw new Error('Auction not found');
      }

      // Update auction
      auction.currentBid = bid.amount;
      auction.highestBidder = bid.bidder;
      await auction.save();

      // Update bid status
      bid.status = 'active';
      await bid.save();

      // Emit to auction room
      io.to(`auction:${auctionId}`).emit('bidUpdate', {
        auction,
        bid,
      });
    } catch (error) {
      console.error('Error handling bid:', error);
    }
  }

  static startAuctionChecker(io: Server) {
    setInterval(async () => {
      try {
        const auctions = await Auction.find({ status: 'active' });
        const now = new Date();

        for (const auction of auctions) {
          if (new Date(auction.endsAt) <= now) {
            // End auction
            auction.status = 'ended';
            await auction.save();

            // Update winning bid
            const winningBid = await Bid.findOne({
              auction: auction._id,
              status: 'active',
            }).sort('-amount');

            if (winningBid) {
              winningBid.status = 'winner';
              await winningBid.save();
            }

            // Emit auction ended event
            io.to(`auction:${auction._id}`).emit('auctionEnded', {
              auction,
              winningBid,
            });
          }
        }
      } catch (error) {
        console.error('Error checking auctions:', error);
      }
    }, 60000); // Check every minute
  }

  static async checkAuctionStatus(io: Server) {
    const auctions = await Auction.find({ status: 'active' });
    const now = new Date();

    for (const auction of auctions) {
      if (now > new Date(auction.endsAt)) {
        await this.endAuction(auction, io);
      }
    }
  }

  static async endAuction(auction: Document & IAuction, io: Server) {
    // Update auction status
    auction.status = 'ended';
    await auction.save();

    // Emit auction ended event
    io.to(`auction:${auction._id.toString()}`).emit('auctionEnded', {
      auction,
    });
  }
}

// Schedule auction status checks every minute
export let ioInstance: Server | null = null;
export function setIoInstance(io: Server) {
  ioInstance = io;
}

// Start auction checker when io instance is available
if (ioInstance) {
  setInterval(() => AuctionService.checkAuctionStatus(ioInstance!), 60000);
}
