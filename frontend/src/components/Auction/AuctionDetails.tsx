import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';

const AuctionDetails: React.FC = () => {
  const { id } = useParams();

  // TODO: Implement auction details fetching
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Auction Details
      </Typography>
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Sample Auction {id}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Description of the auction
          </Typography>
          <Button variant="contained" sx={{ mt: 2 }}>
            Place Bid
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AuctionDetails;
