import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './AuctionList.css';

interface Auction {
  id: string;
  title: string;
  description: string;
  startingPrice: number;
  currentPrice: number;
  endTime: string;
  status: 'active' | 'ended';
}

export const AuctionList: React.FC = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/auctions', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setAuctions(response.data);
      } catch (error) {
        console.error('Error fetching auctions:', error);
        setError('Failed to load auctions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  if (loading) {
    return <div>Loading auctions...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="auction-list">
      <h1>Welcome, {user?.name}!</h1>
      <h2>Active Auctions</h2>
      {auctions.length === 0 ? (
        <p>No active auctions found.</p>
      ) : (
        <div className="auction-grid">
          {auctions.map((auction) => (
            <div key={auction.id} className="auction-card">
              <h3>{auction.title}</h3>
              <p>{auction.description}</p>
              <div className="auction-details">
                <p>Current Price: ${auction.currentPrice}</p>
                <p>Ends: {new Date(auction.endTime).toLocaleString()}</p>
                <p>Status: {auction.status}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


