import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Bid } from '../../types/bid';
import { Auction } from '../../types/auction';

interface BidManagementProps {
  auction: Auction;
}

export const BidManagement: React.FC<BidManagementProps> = ({ auction }) => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newBidAmount, setNewBidAmount] = useState('');
  const { token, user } = useAuth();

  useEffect(() => {
    fetchBids();
  }, [auction._id]);

  const fetchBids = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/bids/auction/${auction._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setBids(response.data);
    } catch (err) {
      const error = err as { response?: { data?: { message: string } } };
      setError(error.response?.data?.message || 'Failed to fetch bids');
      console.error('Error fetching bids:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBidAmount) return;

    try {
      const amount = Number(newBidAmount);
      if (amount <= auction.currentBid) {
        alert('Bid must be higher than current bid');
        return;
      }

      await axios.post(
        `${process.env.REACT_APP_API_URL}/bids/auction/${auction._id}`,
        {
          amount,
          bidder: user?._id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setNewBidAmount('');
      fetchBids();
    } catch (err) {
      const error = err as { response?: { data?: { message: string } } };
      alert(error.response?.data?.message || 'Failed to place bid');
    }
  };

  const handleBidDelete = async (bidId: string) => {
    if (!window.confirm('Are you sure you want to delete this bid?')) return;

    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/bids/auction/${auction._id}/${bidId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      fetchBids();
    } catch (err) {
      const error = err as { response?: { data?: { message: string } } };
      alert(error.response?.data?.message || 'Failed to delete bid');
    }
  };

  if (loading) {
    return <div>Loading bids...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="bid-management">
      <h3>Bid Management</h3>
      
      <div className="current-bid">
        <h4>Current Bid: ${auction.currentBid}</h4>
        {auction.highestBidder && (
          <p>Highest Bidder: {user?._id === auction.highestBidder.toString() ? 'You' : 'Someone else'}</p>
        )}
      </div>

      <form onSubmit={handleBidSubmit} className="bid-form">
        <input
          type="number"
          value={newBidAmount}
          onChange={(e) => setNewBidAmount(e.target.value)}
          placeholder="Enter bid amount"
          min={auction.currentBid + 1}
          required
        />
        <button type="submit">Place Bid</button>
      </form>

      <div className="bids-list">
        <h4>Current Bids</h4>
        {bids.length === 0 ? (
          <p>No bids yet</p>
        ) : (
          <div className="bids-grid">
            {bids.map((bid) => (
              <div key={bid._id} className="bid-card">
                <div className="bid-info">
                  <h5>{bid.bidder.name}</h5>
                  <p>Bid Amount: ${bid.amount}</p>
                  <p>Status: {bid.status}</p>
                  <p>Time: {new Date(bid.createdAt).toLocaleString()}</p>
                </div>
                {bid.bidder._id === user?._id && (
                  <button
                    onClick={() => handleBidDelete(bid._id)}
                    className="delete-bid"
                  >
                    Delete Bid
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
