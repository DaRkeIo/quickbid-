import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';


// Components
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import AuctionList from "./components/Auction/AuctionList";
import AuctionDetails from "./components/Auction/AuctionDetails";
import MyAuctions from './components/Dashboard/MyAuctions';
import { MyBids } from './components/Dashboard/MyBids';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';

// Ensure proper typing for components
const LoginComponent = Login as React.FC;
const RegisterComponent = Register as React.FC;
const AuctionListComponent = AuctionList as React.FC;
const AuctionDetailsComponent = AuctionDetails as React.FC;
const MyAuctionsComponent = MyAuctions as React.FC;
const MyBidsComponent = MyBids as React.FC<{ onBidUpdate?: () => void }>;

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginComponent />} />
            <Route path="/register" element={<RegisterComponent />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <AuctionListComponent />
                </PrivateRoute>
              }
            />
            <Route
              path="/auction/:id"
              element={
                <PrivateRoute>
                  <AuctionDetailsComponent />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/my-auctions"
              element={
                <PrivateRoute>
                  <MyAuctionsComponent />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/my-bids"
              element={
                <PrivateRoute>
                  <MyBidsComponent />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
