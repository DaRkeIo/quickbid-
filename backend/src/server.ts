import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth';
import auctionRoutes from './routes/auctionRoutes';
import bidRoutes from './routes/bidRoutes';
import { errorHandler } from './middleware/errorMiddleware';
import { setupSocket } from './middleware/socketMiddleware';
import { setIoInstance } from './services/auctionService';
import path from 'path';
import http from 'http';
import { logger, errorLogger } from './middleware/logger';

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
  debug: true
});

// Log all environment variables
console.log('Environment Variables:', {
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV
});

// Verify required environment variables
if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
  console.error('Missing required environment variables');
  console.error('MONGODB_URI:', process.env.MONGODB_URI);
  console.error('JWT_SECRET:', process.env.JWT_SECRET);
  process.exit(1);
}

console.log('Loaded Environment Variables:', {
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  PORT: process.env.PORT,
});

if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
  console.error('Missing required environment variables in .env');
  process.exit(1);
}

mongoose
  .connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 45000,
  } as mongoose.ConnectOptions)
  .then(() => {
    console.log('Successfully connected to MongoDB');
    console.log('MongoDB connection details:', {
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      dbName: mongoose.connection.name
    });
    console.log(' MONGODB_URI:', process.env.MONGODB_URI);
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    console.error('MongoDB connection error stack:', error.stack);
    console.error('MongoDB connection error message:', error.message);
    process.exit(1);
  });

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('Mongoose disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('Mongoose reconnected');
});


const app = express();
const server = http.createServer(app);


const io = setupSocket(server);
setIoInstance(io);


const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:5173'  // Vite's default port
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger); // Add request logger

app.get('/', (_req, res) => {
  res.send('BigBid API is running 🚀');
});

app.use('/auth', authRoutes);
app.use('/auctions', auctionRoutes);
app.use('/bids', bidRoutes);

app.use(errorLogger); // Add error logger
app.use(errorHandler);

const PORT = process.env.PORT || 5002;
server.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
