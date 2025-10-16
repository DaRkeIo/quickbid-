import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './components/Auth/Login';
import { Register } from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import { PrivateRoute } from './components/PrivateRoute';
import { AuctionDetails } from './components/Auction/AuctionDetails';
import { CreateAuction } from './components/Auction/CreateAuction';
import { MyBids } from './components/Dashboard/MyBids';
import { MyAuctions } from './components/Dashboard/MyAuctions';
import { AccountPage } from './components/Account/AccountPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/auctions/:id"
        element={
          <PrivateRoute>
            <AuctionDetails />
          </PrivateRoute>
        }
      />
      <Route
        path="/create-auction"
        element={
          <PrivateRoute>
            <CreateAuction />
          </PrivateRoute>
        }
      />
      <Route
        path="/my-auctions"
        element={
          <PrivateRoute>
            <MyAuctions />
          </PrivateRoute>
        }
      />
      <Route
        path="/my-bids"
        element={
          <PrivateRoute>
            <MyBids />
          </PrivateRoute>
        }
      />
      <Route
        path="/account"
        element={
          <PrivateRoute>
            <AccountPage />
          </PrivateRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
