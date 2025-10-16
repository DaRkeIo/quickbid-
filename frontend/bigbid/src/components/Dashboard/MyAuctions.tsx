import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Auction } from '../../types/auction';
import axios from 'axios';
import './MyAuctions.css';
import { BidManagement } from '../Auction/BidManagement';

export const MyAuctions: React.FC = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    const fetchMyAuctions = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/auctions/my-auctions`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setAuctions(response.data);
      } catch (err) {
        const error = err as { response?: { data?: { message: string } } };
        setError(error.response?.data?.message || 'Failed to fetch your auctions');
        console.error('Error fetching auctions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyAuctions();
  }, [token]);

  if (loading) {
    return <div>Loading your auctions...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="my-auctions">
      <h2>My Auctions</h2>
      {auctions.length === 0 ? (
        <p>You haven't created any auctions yet.</p>
      ) : (
        <div className="auctions-grid">
          {auctions.map((auction) => (
            <div key={auction._id} className="auction-card">
              <h3>{auction.title}</h3>
              <p>{auction.description}</p>
              <div className="auction-details">
                <p>Ends: {new Date(auction.endsAt).toLocaleString()}</p>
                <p>Status: {auction.status}</p>
              </div>
              <BidManagement auction={auction} />
              <div className="auction-actions">
                <button onClick={() => window.location.href = `/auctions/${auction._id}`}>
                  View Details
                </button>
                <button onClick={() => window.location.href = `/auctions/edit/${auction._id}`}>
                  Edit
                </button>
                <button
                  style={{ background: '#dc2626' }}
                  onClick={async () => {
                    if (window.confirm('Are you sure you want to delete this auction?')) {
                      try {
                        await axios.delete(`${process.env.REACT_APP_API_URL}/auctions/${auction._id}`, {
                          headers: { Authorization: `Bearer ${token}` }
                        });
                        setAuctions(auctions.filter(a => a._id !== auction._id));
                      } catch (err) {
                        alert('Failed to delete auction');
                      }
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
