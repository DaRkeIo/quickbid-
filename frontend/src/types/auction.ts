export interface Auction {
  _id: string;
  title: string;
  description: string;
  startingBid: number;
  currentBid: number;
  seller: {
    _id: string;
    name: string;
  };
  highestBidder: {
    _id: string;
    name: string;
  } | null;
  status: 'active' | 'completed' | 'cancelled';
  endsAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Bid {
  _id: string;
  auction: Auction;
  user: {
    _id: string;
    name: string;
  };
  amount: number;
  status: 'pending' | 'active' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}
