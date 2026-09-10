import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import apiRouter from './routes/api.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// API Routes
app.use('/api/v1', apiRouter);

// Fallback Root Route
app.get('/', (req, res) => {
  res.json({
    name: 'WEBCRAFT Backend API',
    database: 'WEBCRAFT (MongoDB)',
    version: '1.0.0',
    documentation: '/api/v1/health'
  });
});

// Centralized Error Handling
app.use(errorHandler);

// Start Server & DB Connection
connectDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 [WEBCRAFT Server] Server running on http://0.0.0.0:${PORT}`);
    console.log(`📡 API Endpoints active at http://localhost:${PORT}/api/v1`);
  });
});

