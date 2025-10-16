import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { Auction, Bid } from '../../types/auction';

interface BidHistoryProps {
  auction: Auction;
}

export const BidHistory: React.FC<BidHistoryProps> = ({ auction }) => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/auctions/${auction._id}/bids`);
        if (!response.ok) throw new Error('Failed to fetch bids');
        const data = await response.json();
        setBids(data.bids);
      } catch (error) {
        console.error('Error fetching bids:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBids();
  }, [auction._id]);

  if (loading) {
    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="body1" color="text.secondary" align="center">
          Loading bids...
        </Typography>
      </Box>
    );
  }

  if (!bids || bids.length === 0) {
    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="body1" color="text.secondary" align="center">
          No bids yet
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Bid History
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Bidder</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bids.map((bid) => (
              <TableRow key={bid._id}>
                <TableCell>{bid.bidder.email}</TableCell>
                <TableCell align="right">${bid.amount}</TableCell>
                <TableCell align="right">
                  {bid.status === 'active' && <span style={{ color: 'green' }}>Active</span>}
                  {bid.status === 'outbid' && <span style={{ color: 'orange' }}>Outbid</span>}
                  {bid.status === 'won' && <span style={{ color: 'blue' }}>Winner</span>}
                  {bid.status === 'lost' && <span style={{ color: 'red' }}>Lost</span>}
                </TableCell>
                <TableCell align="right">
                  {new Date(bid.createdAt).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
