import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardContent, Grid, CircularProgress } from '@mui/material';
import { Auction } from '../../types/auction';
import { useAuth, User } from '../../context/AuthContext';
import Timer from '../Timer';
import { BidForm } from './BidForm';
import { BidHistory } from './BidHistory';
import { useBidSocket } from '../../hooks/useBidSocket';

interface AuctionDetailsProps {
  auction: Auction | null;
  onAuctionUpdate?: () => void;
}

export const AuctionDetails = () => {
  const [loading, setLoading] = useState(true);
  const [auction, setAuction] = useState<Auction | null>(null);
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/auctions/${id}`);
        if (!response.ok) throw new Error('Failed to fetch auction');
        const data = await response.json();
        setAuction(data.auction);
      } catch (error) {
        console.error('Error fetching auction:', error);
        navigate('/auctions');
      } finally {
        setLoading(false);
      }
    };

    fetchAuction();
  }, [id, navigate]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!auction) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5">Auction not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', my: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {auction.title}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {auction.description}
          </Typography>
          <Grid container spacing={2}>
            <Grid sx={{ xs: 12, sm: 6 }}>
              <Typography variant="h6" gutterBottom>
                Current Bid: ${auction.currentBid}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Highest Bidder: {auction.highestBidder?.email}
              </Typography>
            </Grid>
            <Grid sx={{ xs: 12, sm: 6 }}>
              <Typography variant="h6" gutterBottom>
                Ends In:
              </Typography>
              <Timer endsAt={auction.endsAt} />
            </Grid>
          </Grid>
          <Typography variant="body1" gutterBottom>
            Seller: {auction.seller.email}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Status: {auction.status}
          </Typography>
          <BidForm auction={auction} />
          <BidHistory auction={auction} />
        </CardContent>
      </Card>
    </Box>
  );
};
export default AuctionDetails;
