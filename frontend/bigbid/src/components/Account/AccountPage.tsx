import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './AccountPage.css';

export const AccountPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="account-layout">
      <aside className="account-sidebar">
        <button className="sidebar-btn" onClick={() => navigate('/create-auction')}>Create Auction</button>
        <button className="sidebar-btn" onClick={() => navigate('/my-auctions')}>Manage My Auctions</button>
        <button className="sidebar-btn" onClick={() => navigate('/auction-history')}>Auction History</button>
        <button className="sidebar-btn" onClick={() => navigate('/payments')}>Payments</button>
        <button className="sidebar-btn" onClick={() => navigate('/items-bought')}>Items Bought</button>
      </aside>
      <main className="account-page">
        <h2>My Account</h2>
        <div className="account-details">
          <div className="account-row">
            <span className="label">Name:</span>
            <span className="value">{user?.name}</span>
          </div>
          <div className="account-row">
            <span className="label">Email:</span>
            <span className="value">{user?.email}</span>
          </div>
        </div>
      </main>
    </div>
  );
}; 