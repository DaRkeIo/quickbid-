import { User } from '../context/AuthContext';

export interface Auction {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  startingPrice: number;
  currentBid: number;
  highestBidder: User | null;
  seller: User;
  endsAt: string;
  status: 'active' | 'ended' | 'cancelled';
  category: 'Electronics' | 'Fashion' | 'Home & Garden' | 'Sports' | 'Collectibles' | 'Vehicles' | 'Other';
  createdAt?: string;
  updatedAt?: string;
}

export interface Bid {
  _id: string;
  auction: Auction;
  bidder: User;
  amount: number;
  status: 'active' | 'outbid' | 'won' | 'lost';
  createdAt: string;
  updatedAt: string;
}

export interface TimerProps {
  endsAt: string;
}
