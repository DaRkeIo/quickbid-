import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
  Chip,
  Stack,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Timer from '../Timer';
import { useAuth } from '../../context/AuthContext';
import { Auction } from '../../types/auction';

interface AuctionCardProps {
  auction: Auction;
}

const AuctionCard: React.FC<AuctionCardProps> = ({ auction }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleViewDetails = () => {
    navigate(`/auction/${auction._id}`);
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-5px)',
        },
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={auction.imageUrl}
        alt={auction.title}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h2">
          {auction.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {auction.description}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="h6" color="primary">
              ${auction.currentBid}
            </Typography>
            {auction.highestBidder && (
              <Chip
                label="Active Bid"
                color="primary"
                size="small"
              />
            )}
          </Stack>
          <Timer endsAt={auction.endsAt} />
        </Box>
      </CardContent>
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleViewDetails}
        >
          View Details
        </Button>
      </Box>
    </Card>
  );
};

export default AuctionCard;
