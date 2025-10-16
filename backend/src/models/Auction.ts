import mongoose, { Schema } from 'mongoose';

export interface IAuction {
  title: string;
  description: string;
  imageUrl: string;
  startingBid: number;
  currentBid: number;
  highestBidder: mongoose.Types.ObjectId | null;
  seller: mongoose.Types.ObjectId;
  endsAt: Date;
  status: 'active' | 'ended';
  category: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const auctionSchema = new Schema<IAuction>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  startingBid: {
    type: Number,
    required: true,
    min: 0,
  },
  currentBid: {
    type: Number,
    default: 0,
  },
  highestBidder: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  endsAt: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'ended'],
    default: 'active',
  },
  category: {
    type: String,
    required: true,
    enum: ['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Collectibles', 'Vehicles', 'Other'],
    default: 'Other'
  }
}, {
  timestamps: true,
});

// Method to check if auction is active
auctionSchema.methods.isActive = function(): boolean {
  return this.status === 'active' && new Date(this.endsAt) > new Date();
};

export const Auction = mongoose.model<IAuction>('Auction', auctionSchema);
