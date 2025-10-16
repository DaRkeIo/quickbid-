import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  MenuItem,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './CreateAuction.css';

const STATIC_CATEGORIES = [
  "Electronics",
  "Vehicles",
  "Antiques",
  "Fashion",
  "Home & Garden",
  "Sports",
  "Collectibles",
  "Other"
];

export const CreateAuction = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [startingBid, setStartingBid] = useState('');
  const [category, setCategory] = useState('');
  const [startsAt, setStartsAt] = useState('');
  const [endsAt, setEndsAt] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      navigate('/login');
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auctions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
          startingBid: parseFloat(startingBid),
          currentBid: parseFloat(startingBid),
          category,
          endsAt,
          status: 'active'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Failed to create auction');
      }

      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating auction:', error);
      const message = error instanceof Error ? error.message : String(error);
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="create-auction-container" sx={{ maxWidth: 600, mx: 'auto', my: 4 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Create New Auction
      </Typography>
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
            <Box sx={{ width: '100%' }}>
              <TextField
                fullWidth
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Box>
            <Box sx={{ width: '100%' }}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Box>
            <Box sx={{ width: '100%' }}>
              <TextField
                fullWidth
                label="Image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                required
              />
            </Box>
            <Box sx={{ width: '100%' }}>
              <TextField
                fullWidth
                label="Starting Bid"
                type="number"
                value={startingBid}
                onChange={(e) => setStartingBid(e.target.value)}
                required
              />
            </Box>
            <Box sx={{ width: '100%' }}>
              <TextField
                select
                fullWidth
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                {STATIC_CATEGORIES.map((cat) => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </TextField>
            </Box>
            <Box sx={{ width: '100%' }}>
              <TextField
                fullWidth
                label="Start Date"
                type="datetime-local"
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Box>
            <Box sx={{ width: '100%' }}>
              <TextField
                fullWidth
                label="End Date"
                type="datetime-local"
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Box>
            <Box sx={{ width: '100%' }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                fullWidth
              >
                {loading ? <CircularProgress size={24} /> : 'Create Auction'}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};
