import mongoose, { Schema } from 'mongoose';


export interface IBid {
  auction: mongoose.Types.ObjectId;
  bidder: mongoose.Types.ObjectId;
  amount: number;
  status: 'active' | 'outbid' | 'winner';
  createdAt?: Date;
  updatedAt?: Date;
}

const bidSchema = new Schema<IBid>({
  auction: {
    type: Schema.Types.ObjectId,
    ref: 'Auction',
    required: true,
  },
  bidder: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ['active', 'outbid', 'winner'],
    default: 'active',
  },
}, {
  timestamps: true,
});

bidSchema.index({ auction: 1, bidder: 1 }, { unique: true });

export const Bid = mongoose.model<IBid>('Bid', bidSchema);
