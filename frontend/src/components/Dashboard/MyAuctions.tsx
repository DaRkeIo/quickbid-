import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { Auction } from '../../types/auction';
import { useNavigate } from 'react-router-dom';
import { Delete as DeleteIcon } from '@mui/icons-material';

interface MyAuctionsProps {
  onAuctionDelete?: (auctionId: string) => void;
}

const MyAuctions: React.FC<MyAuctionsProps> = ({ onAuctionDelete }) => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuctions = async () => {
      if (!user || !token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/auctions`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch auctions');
        }

        const data = await response.json();
        setAuctions(data.auctions.filter((a: Auction) => a.seller.toString() === user._id.toString()));
      } catch (error) {
        console.error('Error fetching auctions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, [user, token, navigate]);

  const handleDelete = async (auctionId: string) => {
    if (!token) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auctions/${auctionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete auction');
      }

      setAuctions(auctions.filter(a => a._id !== auctionId));
      onAuctionDelete?.(auctionId);
    } catch (error) {
      console.error('Error deleting auction:', error);
    }
  };

  const handleCreateAuction = () => {
    navigate('/create-auction');
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        My Auctions
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateAuction}
        sx={{ mb: 2 }}
      >
        Create New Auction
      </Button>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {auctions.map((auction) => (
          <Box
            key={auction._id}
            sx={{
              width: { xs: '100%', sm: '50%', md: '33.33%' },
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {auction.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Starting Bid: ${auction.startingBid}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Status: {auction.status}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="outlined"
                  onClick={() => navigate(`/auction/${auction._id}`)}
                >
                  View Details
                </Button>
                <IconButton
                  color="error"
                  onClick={() => handleDelete(auction._id)}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default MyAuctions;
