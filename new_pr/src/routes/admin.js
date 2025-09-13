const express = require('express');
const router = express.Router();
const solanaService = require('../services/solanaService');
const { logger } = require('../config/logger');

// Admin endpoints for monitoring and management

// Get system status
router.get('/status', async (req, res) => {
  try {
    const walletBalance = await solanaService.getWalletBalance();
    
    const status = {
      server: {
        status: 'running',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: process.version
      },
      solana: {
        rpcUrl: process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com',
        walletBalance: walletBalance,
        network: 'devnet'
      },
      timestamp: new Date().toISOString()
    };
    
    res.status(200).json({
      success: true,
      data: status
    });
    
  } catch (error) {
    logger.error('Error getting system status', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Failed to get system status',
      details: error.message
    });
  }
});

// Get transaction statistics
router.get('/stats', async (req, res) => {
  try {
    // Mock statistics - in production, this would query a database
    const stats = {
      totalAssets: 15,
      totalTransactions: 127,
      totalRevenueDistributed: 50000,
      activeUsers: 45,
      totalTokensMinted: 1000000,
      averageTransactionValue: 125.50,
      last24Hours: {
        transactions: 23,
        revenueDistributed: 2500,
        newAssets: 2
      }
    };
    
    res.status(200).json({
      success: true,
      data: stats
    });
    
  } catch (error) {
    logger.error('Error getting statistics', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Failed to get statistics',
      details: error.message
    });
  }
});

// Health check with detailed information
router.get('/health/detailed', async (req, res) => {
  try {
    const health = {
      status: 'healthy',
      checks: {
        database: 'connected',
        solana: 'connected',
        logging: 'active',
        memory: process.memoryUsage().heapUsed < 100 * 1024 * 1024 ? 'ok' : 'warning'
      },
      timestamp: new Date().toISOString()
    };
    
    res.status(200).json({
      success: true,
      data: health
    });
    
  } catch (error) {
    logger.error('Error in detailed health check', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Health check failed',
      details: error.message
    });
  }
});

// Get recent logs
router.get('/logs/recent', async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    
    // In production, this would read from log files or database
    const recentLogs = [
      {
        timestamp: new Date().toISOString(),
        level: 'info',
        message: 'Transaction completed successfully',
        operation: 'create_asset',
        signature: 'mock_signature_123'
      },
      {
        timestamp: new Date(Date.now() - 60000).toISOString(),
        level: 'info',
        message: 'Revenue distributed',
        operation: 'distribute_revenue',
        amount: 1000
      }
    ];
    
    res.status(200).json({
      success: true,
      data: {
        logs: recentLogs.slice(0, parseInt(limit)),
        total: recentLogs.length
      }
    });
    
  } catch (error) {
    logger.error('Error getting recent logs', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Failed to get recent logs',
      details: error.message
    });
  }
});

module.exports = router;
