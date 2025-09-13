const express = require('express');
const router = express.Router();
const solanaService = require('../services/solanaService');
const { logger } = require('../config/logger');

// Buy fraction tokens
router.post('/buy_fraction', async (req, res) => {
  try {
    const { assetMint, amount, buyer, pricePerToken } = req.body;
    
    // Validate required fields
    if (!assetMint || !amount || !buyer || !pricePerToken) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: assetMint, amount, buyer, pricePerToken'
      });
    }
    
    // Validate data types
    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'amount must be a positive number'
      });
    }
    
    if (typeof pricePerToken !== 'number' || pricePerToken <= 0) {
      return res.status(400).json({
        success: false,
        error: 'pricePerToken must be a positive number'
      });
    }
    
    // Validate public key format
    try {
      new (require('@solana/web3.js').PublicKey)(assetMint);
      new (require('@solana/web3.js').PublicKey)(buyer);
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'Invalid public key format for assetMint or buyer'
      });
    }
    
    const buyData = {
      assetMint,
      amount,
      buyer,
      pricePerToken
    };
    
    logger.info('Buying fraction tokens', { buyData });
    
    const result = await solanaService.buyFractions(buyData);
    
    res.status(200).json({
      success: true,
      message: 'Fraction tokens purchased successfully',
      data: result
    });
    
  } catch (error) {
    logger.error('Error buying fraction tokens', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Failed to buy fraction tokens',
      details: error.message
    });
  }
});

// Distribute revenue to token holders
router.post('/distribute_revenue', async (req, res) => {
  try {
    const { assetMint, totalRevenue, distributionMethod } = req.body;
    
    // Validate required fields
    if (!assetMint || !totalRevenue) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: assetMint, totalRevenue'
      });
    }
    
    // Validate data types
    if (typeof totalRevenue !== 'number' || totalRevenue <= 0) {
      return res.status(400).json({
        success: false,
        error: 'totalRevenue must be a positive number'
      });
    }
    
    // Validate public key format
    try {
      new (require('@solana/web3.js').PublicKey)(assetMint);
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'Invalid assetMint format'
      });
    }
    
    const distributionData = {
      assetMint,
      totalRevenue,
      distributionMethod: distributionMethod || 'proportional'
    };
    
    logger.info('Distributing revenue', { distributionData });
    
    const result = await solanaService.distributeRevenue(distributionData);
    
    res.status(200).json({
      success: true,
      message: 'Revenue distributed successfully',
      data: result
    });
    
  } catch (error) {
    logger.error('Error distributing revenue', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Failed to distribute revenue',
      details: error.message
    });
  }
});

// Get transaction history
router.get('/history/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const { limit = 10, offset = 0 } = req.query;
    
    // Validate public key format
    try {
      new (require('@solana/web3.js').PublicKey)(address);
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'Invalid address format'
      });
    }
    
    // Mock transaction history - in real implementation, this would fetch from blockchain
    const transactions = [
      {
        signature: 'mock_signature_1',
        type: 'buy_fraction',
        amount: 100,
        timestamp: new Date().toISOString(),
        status: 'confirmed'
      },
      {
        signature: 'mock_signature_2',
        type: 'distribute_revenue',
        amount: 50,
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        status: 'confirmed'
      }
    ];
    
    res.status(200).json({
      success: true,
      data: {
        transactions: transactions.slice(offset, offset + parseInt(limit)),
        total: transactions.length,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
    
  } catch (error) {
    logger.error('Error fetching transaction history', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Failed to fetch transaction history',
      details: error.message
    });
  }
});

// Get wallet balance
router.get('/balance/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    // Validate public key format
    try {
      new (require('@solana/web3.js').PublicKey)(address);
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'Invalid address format'
      });
    }
    
    const balance = await solanaService.getWalletBalance();
    
    res.status(200).json({
      success: true,
      data: {
        address,
        solBalance: balance,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    logger.error('Error fetching wallet balance', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Failed to fetch wallet balance',
      details: error.message
    });
  }
});

module.exports = router;
