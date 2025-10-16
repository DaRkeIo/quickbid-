import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { Bid } from '../models/Bid';
import { Auction } from '../models/Auction';

interface SocketUser {
  _id: string;
  email: string;
}

interface SocketWithAuth extends Socket {
  user?: SocketUser;
}

export const setupSocket = (httpServer: HttpServer) => {
  const io = new Server<SocketWithAuth>(httpServer, {
    cors: {
      origin: ['http://localhost:3000', 'http://localhost:3001'],
      methods: ['GET', 'POST'],
    },
  });

  io.use(async (socket: SocketWithAuth, next: (err?: Error) => void) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication error'));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
      const user = await User.findById(decoded.userId);
      if (!user) return next(new Error('User not found'));

      socket.user = {
        _id: user._id.toString(),
        email: user.email,
      };
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', async (socket: SocketWithAuth) => {
    console.log('User connected:', socket.user?.email);

    // Join auction rooms
    if (socket.user) {
      // Join all auctions the user is participating in
      const bids = await Bid.find({ bidder: socket.user._id });
      bids.forEach(bid => {
        socket.join(`auction:${bid.auction.toString()}`);
      });

      // Join all auctions the user is selling
      const auctions = await Auction.find({ seller: socket.user._id });
      auctions.forEach(auction => {
        socket.join(`auction:${auction._id.toString()}`);
      });
    }

    socket.on('joinAuction', (auctionId: string) => {
      socket.join(`auction:${auctionId}`);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.user?.email);
    });
  });

  return io;
};;
