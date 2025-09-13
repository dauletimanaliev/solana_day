const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { logger } = require('./config/logger');
const solanaConfig = require('./config/solana');

// Import routes
const assetsRoutes = require('./routes/assets');
const transactionsRoutes = require('./routes/transactions');
const simulationRoutes = require('./routes/simulation');
const adminRoutes = require('./routes/admin');
const analyticsRoutes = require('./routes/analytics');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.'
  }
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] 
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info('API Request', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Solana Fractional Assets API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/assets', assetsRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/simulation', simulationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/analytics', analyticsRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Solana Fractional Assets API',
    endpoints: {
      health: '/health',
      assets: {
        create: 'POST /api/assets/create_asset',
        mint: 'POST /api/assets/mint_fraction',
        get: 'GET /api/assets/asset/:assetMint'
      },
      transactions: {
        buy: 'POST /api/transactions/buy_fraction',
        distribute: 'POST /api/transactions/distribute_revenue',
        history: 'GET /api/transactions/history/:address',
        balance: 'GET /api/transactions/balance/:address'
      },
      simulation: {
        simulate: 'POST /api/simulation/simulate_revenue',
        history: 'GET /api/simulation/simulation_history',
        random: 'POST /api/simulation/generate_random_revenue'
      },
      admin: {
        status: 'GET /api/admin/status',
        stats: 'GET /api/admin/stats',
        health: 'GET /api/admin/health/detailed',
        logs: 'GET /api/admin/logs/recent'
      },
      analytics: {
        assetPerformance: 'GET /api/analytics/assets/:assetMint/performance',
        userPortfolio: 'GET /api/analytics/users/:address/portfolio',
        marketOverview: 'GET /api/analytics/market/overview',
        revenueDistribution: 'GET /api/analytics/revenue/distribution'
      }
    },
    documentation: 'See README.md for detailed API documentation'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });
  
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Start server
app.listen(PORT, () => {
  logger.info('Server started', {
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
  
  console.log(`🚀 Solana Fractional Assets API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API documentation: http://localhost:${PORT}/`);
  
  // Log Solana configuration
  try {
    const wallet = solanaConfig.getWallet();
    logger.info('Solana configuration loaded', {
      walletPublicKey: wallet.publicKey.toString(),
      rpcUrl: process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com',
      programId: solanaConfig.getProgramId().toString()
    });
  } catch (error) {
    logger.warn('Solana configuration warning', { error: error.message });
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

module.exports = app;
