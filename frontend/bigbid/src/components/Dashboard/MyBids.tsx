import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
} from '@mui/material';
import { GridProps } from '@mui/material/Grid/Grid';
import { GridSize } from '@mui/system';
import { useAuth } from '../../context/AuthContext';
import { Auction, Bid } from '../../types/auction';
import { useNavigate } from 'react-router-dom';
import Timer from '../../hooks/useCountdown';

interface MyBidsProps {
  onBidUpdate?: () => void;
};

export const MyBids: React.FC<MyBidsProps> = ({ onBidUpdate }) => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBids = async () => {
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const response = await fetch('/bids/my-bids', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();
        setBids(data.bids);
      } catch (error) {
        console.error('Error fetching bids:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBids();
  }, [token, navigate]);

  return (
    <Box>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Typography variant="h5" gutterBottom>
            My Bids
          </Typography>
          <Grid container spacing={3}>
            {bids.map((bid) => (
              <Box sx={{ width: '100%' }} key={bid._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {bid.auction.title}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Typography color="text.secondary">
                        Your Bid: ${bid.amount}
                      </Typography>
                      <Typography color="text.secondary">
                        Status: {bid.status}
                      </Typography>
                      {bid.auction.status === 'active' && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Typography color="text.secondary">
                            Current Bid: ${bid.auction.currentBid}
                          </Typography>
                          <Typography color="text.secondary">
                            Highest Bidder: {bid.auction.highestBidder?.name || 'No bidder'}
                          </Typography>
                          <Typography color="text.secondary">
                            Ends In:
                            <Timer endsAt={bid.auction.endsAt} />
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => navigate(`/auctions/${bid.auction._id}`)}
                    >
                      View Auction
                    </Button>
                  </CardActions>
                </Card>
              </Box>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
};
