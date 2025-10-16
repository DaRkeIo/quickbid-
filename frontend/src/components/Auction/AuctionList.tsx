import React from 'react';
import { Box, Grid, Card, CardContent, Typography } from '@mui/material';

const AuctionList = (): React.ReactElement => {
  // TODO: Implement auction list fetching and display
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Current Auctions
      </Typography>
      <Grid container spacing={3}>
        {/* TODO: Map over auction data to display cards */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sample Auction
              </Typography>
              <Typography variant="body2">
                Description of the auction
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AuctionList;
