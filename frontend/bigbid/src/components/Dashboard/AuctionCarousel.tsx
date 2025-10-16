import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auction } from '../../types/auction';
import './AuctionCarousel.css';

interface AuctionCarouselProps {
  auctions: Auction[];
}

const AuctionCarousel: React.FC<AuctionCarouselProps> = ({ auctions }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === auctions.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [auctions.length]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? auctions.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === auctions.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleAuctionClick = (auctionId: string) => {
    navigate(`/auction/${auctionId}`);
  };

  if (!auctions.length) return null;

  return (
    <div className="carousel-container">
      <div className="carousel-header">
        <h2>Live Auctions</h2>
        <div className="carousel-controls">
          <button onClick={handlePrev} className="carousel-button prev">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button onClick={handleNext} className="carousel-button next">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="carousel">
        <div 
          className="carousel-track"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {auctions.map((auction) => (
            <div 
              key={auction._id} 
              className="carousel-slide"
              onClick={() => handleAuctionClick(auction._id)}
            >
              <div className="auction-card">
                <div className="auction-image">
                  <img src={auction.imageUrl} alt={auction.title} />
                  <div className="auction-overlay">
                    <span className="live-badge">LIVE</span>
                  </div>
                </div>
                <div className="auction-info">
                  <h3>{auction.title}</h3>
                  <p className="auction-description">{auction.description}</p>
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
            </div>
          ))}
        </div>
      </div>

      <div className="carousel-indicators">
        {auctions.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default AuctionCarousel; 