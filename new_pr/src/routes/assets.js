const express = require('express');
const router = express.Router();
const solanaService = require('../services/solanaService');
const { logger } = require('../config/logger');

// Create a new fractional asset
router.post('/create_asset', async (req, res) => {
  try {
    const { name, symbol, totalSupply, pricePerToken, description } = req.body;
    
    // Validate required fields
    if (!name || !symbol || !totalSupply || !pricePerToken) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, symbol, totalSupply, pricePerToken'
      });
    }
    
    // Validate data types
    if (typeof totalSupply !== 'number' || totalSupply <= 0) {
      return res.status(400).json({
        success: false,
        error: 'totalSupply must be a positive number'
      });
    }
    
    if (typeof pricePerToken !== 'number' || pricePerToken <= 0) {
      return res.status(400).json({
        success: false,
        error: 'pricePerToken must be a positive number'
      });
    }
    
    const assetData = {
      name,
      symbol,
      totalSupply,
      pricePerToken,
      description: description || ''
    };
    
    logger.info('Creating asset', { assetData });
    
    const result = await solanaService.createAsset(assetData);
    
    res.status(201).json({
      success: true,
      message: 'Asset created successfully',
      data: result
    });
    
  } catch (error) {
    logger.error('Error creating asset', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Failed to create asset',
      details: error.message
    });
  }
});

// Mint fraction tokens
router.post('/mint_fraction', async (req, res) => {
  try {
    const { assetMint, amount, recipient } = req.body;
    
    // Validate required fields
    if (!assetMint || !amount || !recipient) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: assetMint, amount, recipient'
      });
    }
    
    // Validate data types
    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'amount must be a positive number'
      });
    }
    
    // Validate public key format
    try {
      new (require('@solana/web3.js').PublicKey)(assetMint);
      new (require('@solana/web3.js').PublicKey)(recipient);
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'Invalid public key format for assetMint or recipient'
      });
    }
    
    const mintData = {
      assetMint,
      amount,
      recipient
    };
    
    logger.info('Minting fraction tokens', { mintData });
    
    const result = await solanaService.mintFractionTokens(mintData);
    
    res.status(200).json({
      success: true,
      message: 'Fraction tokens minted successfully',
      data: result
    });
    
  } catch (error) {
    logger.error('Error minting fraction tokens', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Failed to mint fraction tokens',
      details: error.message
    });
  }
});

// Get asset information
router.get('/asset/:assetMint', async (req, res) => {
  try {
    const { assetMint } = req.params;
    
    // Validate public key format
    try {
      new (require('@solana/web3.js').PublicKey)(assetMint);
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'Invalid assetMint format'
      });
    }
    
    // Mock asset data - in real implementation, this would fetch from blockchain
    const assetInfo = {
      assetMint,
      name: 'Sample Asset',
      symbol: 'SAMP',
      totalSupply: 1000000,
      pricePerToken: 0.01,
      description: 'A sample fractional asset',
      createdAt: new Date().toISOString()
    };
    
    res.status(200).json({
      success: true,
      data: assetInfo
    });
    
  } catch (error) {
    logger.error('Error fetching asset info', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Failed to fetch asset information',
      details: error.message
    });
  }
});

module.exports = router;
