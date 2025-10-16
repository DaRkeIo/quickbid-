import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Stack,
  Paper,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { Auction } from '../../types/auction';
import { useNavigate } from 'react-router-dom';

interface BidFormProps {
  auction: Auction;
  onBidPlaced?: () => void;
}

export const BidForm: React.FC<BidFormProps> = ({ auction, onBidPlaced }) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      navigate('/login');
      return;
    }
    setError('');

    const currentBid = auction.currentBid || auction.startingPrice;
    if (parseFloat(amount) <= currentBid) {
      setError('Bid amount must be higher than current bid');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/bids/${auction._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: parseFloat(amount) }),
      });

      if (!response.ok) {
        throw new Error('Failed to place bid');
      }

      // Clear form and error
      setAmount('');
      setError('');
      onBidPlaced?.();
    } catch (error) {
      setError('Failed to place bid. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Paper>
        <form onSubmit={handleSubmit}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Place a Bid
            </Typography>
            {error && (
              <Typography color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}
            <TextField
              fullWidth
              label="Bid Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              sx={{ mb: 2 }}
              disabled={loading}
              error={error !== ''}
              helperText={error}
              inputProps={{
                min: (auction.currentBid || auction.startingPrice) + 1,
                step: 0.01,
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading || auction.status !== 'active'}
            >
              {loading ? 'Placing Bid...' : 'Place Bid'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};
