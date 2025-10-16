import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AccountMenu.css';

export const AccountMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="account-menu">
      <button 
        className="account-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="account-avatar">
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <span className="account-name">{user?.name || 'User'}</span>
      </button>

      {isOpen && (
        <div className="account-dropdown">
          <div className="account-info">
            <div className="account-email">{user?.email}</div>
          </div>
          <div className="dropdown-divider"></div>
          <button 
            className="dropdown-item"
            onClick={() => {
              setIsOpen(false);
              navigate('/account');
            }}
          >
            Account
          </button>
          <div className="dropdown-divider"></div>
          <button 
            className="dropdown-item"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}; 