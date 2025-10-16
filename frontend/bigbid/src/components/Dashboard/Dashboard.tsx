import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { AccountMenu } from './AccountMenu';
import AuctionCarousel from './AuctionCarousel';
import { Auction } from '../../types/auction';
import './Dashboard.css';

const STATIC_CATEGORIES = [
  "Electronics",
  "Vehicles",
  "Antiques",
  "Fashion",
  "Home & Garden",
  "Sports",
  "Collectibles",
  "Other"
];

const getCategoryIcon = (category: string) => {
  const icons: { [key: string]: string } = {
    'Electronics': '📱',
    'Vehicles': '🚗',
    'Antiques': '🏺',
    'Fashion': '👕',
    'Home & Garden': '🏡',
    'Sports': '⚽',
    'Collectibles': '🎨',
    'Other': '📦'
  };
  return icons[category] || '📦';
};

const getCategoryDescription = (category: string) => {
  const descriptions: { [key: string]: string } = {
    'Electronics': 'Latest gadgets and tech devices',
    'Vehicles': 'Cars, bikes, and automotive items',
    'Antiques': 'Vintage and collectible items',
    'Fashion': 'Clothing, accessories, and style',
    'Home & Garden': 'Furniture and decor items',
    'Sports': 'Sports equipment and memorabilia',
    'Collectibles': 'Rare and unique collectibles',
    'Other': 'Miscellaneous items'
  };
  return descriptions[category] || 'Various items';
};

const Dashboard: React.FC = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/auctions`);
        setAuctions(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch auctions');
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  const categories = Array.from(new Set(auctions.map(auction => auction.category)));

  const filteredAuctions = auctions.filter(auction => {
    const matchesCategory = !selectedCategory || auction.category === selectedCategory;
    const matchesSearch = auction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         auction.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  if (loading) return <div className="loading">Loading auctions...</div>;
  if (error) return <div className="error">{error}</div>;

  const liveAuctions = filteredAuctions.filter(auction => new Date(auction.endsAt) > new Date());
  const upcomingAuctions = filteredAuctions.filter(auction => new Date(auction.endsAt) > new Date());

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>BigBid</h1>
        <div className="header-actions">
          <AccountMenu />
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search auctions..."
              value={searchQuery}
              onChange={handleSearch}
            />
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <aside className="dashboard-sidebar">
          <h3>Categories</h3>
          <div className="featured-categories">
            {STATIC_CATEGORIES.map((category) => (
              <div 
                key={category} 
                className="category-card"
                onClick={() => setSelectedCategory(category)}
              >
                <div className="category-icon">
                  {getCategoryIcon(category)}
                </div>
                <div className="category-info">
                  <h4>{category}</h4>
                  <span className="category-count">
                    {filteredAuctions.filter(a => a.category === category).length} items
                  </span>
                </div>
              </div>
            ))}
          </div>
        </aside>

        <main className="dashboard-main">
          <div className="auction-section">
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 700,
              margin: '0 0 1.5rem 0',
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '1px',
            }}>Live Auctions</h2>
            <AuctionCarousel auctions={liveAuctions} />
          </div>

          <div className="auction-section">
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 700,
              margin: '2rem 0 1.5rem 0',
              background: 'linear-gradient(45deg, #00c6ff, #0072ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '1px',
            }}>Upcoming Auctions</h2>
            <AuctionCarousel auctions={upcomingAuctions} />
          </div>

          <div className="auctions-grid">
            {filteredAuctions.length === 0 ? (
              <div className="no-auctions">No auctions found in this category or search.</div>
            ) : (
              filteredAuctions.map((auction) => (
                <div
                  key={auction._id}
                  className="auction-card"
                  onClick={() => navigate(`/auction/${auction._id}`)}
                >
                  <div className="auction-image">
                    <img src={auction.imageUrl} alt={auction.title} />
                  </div>
                  <div className="auction-info">
                    <h3>{auction.title}</h3>
                    <p>{auction.description}</p>
                    <div className="auction-details">
                      <div className="price">
                        <span className="label">Current Bid</span>
                        <span className="value">${auction.currentBid}</span>
                      </div>
                      <div className="time-left">
                        <span className="label">Time Left</span>
                        <span className="value">
                          {new Date(auction.endsAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard; 