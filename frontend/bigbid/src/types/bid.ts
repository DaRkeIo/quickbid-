export interface Bid {
  _id: string;
  auction: string;
  bidder: {
    _id: string;
    name: string;
    email: string;
  };
  amount: number;
  status: 'active' | 'outbid' | 'winner';
  createdAt: string;
  updatedAt: string;
}
