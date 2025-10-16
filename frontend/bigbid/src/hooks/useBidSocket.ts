import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Auction } from '../types/auction';

interface BidEvent {
  auctionId: string;
  currentBid: number;
  highestBidder: string;
}

interface AuctionEndedEvent {
  auctionId: string;
  winner: string;
  finalBid: number;
}

export interface BidSocket {
  socket: Socket | null;
  joinAuction: (auctionId: string) => void;
  leaveAuction: (auctionId: string) => void;
  newBid: (handler: (data: BidEvent) => void) => () => void;
  auctionEnded: (handler: (data: AuctionEndedEvent) => void) => () => void;
}

export const useBidSocket = (): BidSocket => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const newSocket = io('http://localhost:5002', {
      auth: { token },
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const joinAuction = (auctionId: string) => {
    if (socket) {
      socket.emit('joinAuction', auctionId);
    }
  };

  const leaveAuction = (auctionId: string) => {
    if (socket) {
      socket.emit('leaveAuction', auctionId);
    }
  };

  const newBid = (handler: (data: BidEvent) => void) => {
    if (socket) {
      socket.on('newBid', handler);
      return () => {
        socket.off('newBid', handler);
      };
    }
    return () => {};
  };

  const auctionEnded = (handler: (data: AuctionEndedEvent) => void) => {
    if (socket) {
      socket.on('auctionEnded', handler);
      return () => {
        socket.off('auctionEnded', handler);
      };
    }
    return () => {};
  };

  return {
    socket,
    joinAuction,
    leaveAuction,
    newBid,
    auctionEnded,
  };
};
