const express = require('express');
const router = express.Router();
const solanaService = require('../services/solanaService');
const { logger } = require('../config/logger');

// Simulate revenue generation and distribution
router.post('/simulate_revenue', async (req, res) => {
  try {
    const { assetMint, revenueAmount, distributionMethod } = req.body;
    
    // Validate required fields
    if (!assetMint || !revenueAmount) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: assetMint, revenueAmount'
      });
    }
    
    // Validate data types
    if (typeof revenueAmount !== 'number' || revenueAmount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'revenueAmount must be a positive number'
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
    
    logger.info('Simulating revenue distribution', { 
      assetMint, 
      revenueAmount, 
      distributionMethod: distributionMethod || 'proportional' 
    });
    
    // Simulate revenue distribution
    const simulationData = {
      assetMint,
      totalRevenue: revenueAmount,
      distributionMethod: distributionMethod || 'proportional'
    };
    
    // Call the actual distribution function
    const result = await solanaService.distributeRevenue(simulationData);
    
    // Add simulation metadata
    const simulationResult = {
      ...result,
      simulation: true,
      simulatedAt: new Date().toISOString(),
      revenueSource: 'simulation',
      distributionBreakdown: {
        totalRevenue: revenueAmount,
        distributionMethod: distributionMethod || 'proportional',
        estimatedHolders: 150, // Mock data
        averageDistribution: revenueAmount / 150
      }
    };
    
    res.status(200).json({
      success: true,
      message: 'Revenue simulation completed successfully',
      data: simulationResult
    });
    
  } catch (error) {
    logger.error('Error simulating revenue', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Failed to simulate revenue distribution',
      details: error.message
    });
  }
});

// Get simulation history
router.get('/simulation_history', async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;
    
    // Mock simulation history
    const simulations = [
      {
        id: 'sim_1',
        assetMint: 'mock_asset_mint_1',
        revenueAmount: 1000,
        distributionMethod: 'proportional',
        timestamp: new Date().toISOString(),
        status: 'completed'
      },
      {
        id: 'sim_2',
        assetMint: 'mock_asset_mint_2',
        revenueAmount: 500,
        distributionMethod: 'proportional',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        status: 'completed'
      }
    ];
    
    res.status(200).json({
      success: true,
      data: {
        simulations: simulations.slice(offset, offset + parseInt(limit)),
        total: simulations.length,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
    
  } catch (error) {
    logger.error('Error fetching simulation history', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Failed to fetch simulation history',
      details: error.message
    });
  }
});

// Generate random revenue for testing
router.post('/generate_random_revenue', async (req, res) => {
  try {
    const { assetMint, minAmount = 100, maxAmount = 1000 } = req.body;
    
    if (!assetMint) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: assetMint'
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
    
    // Generate random revenue amount
    const randomRevenue = Math.floor(Math.random() * (maxAmount - minAmount + 1)) + minAmount;
    
    logger.info('Generating random revenue', { 
      assetMint, 
      randomRevenue, 
      minAmount, 
      maxAmount 
    });
    
    // Simulate the revenue distribution
    const simulationData = {
      assetMint,
      totalRevenue: randomRevenue,
      distributionMethod: 'proportional'
    };
    
    const result = await solanaService.distributeRevenue(simulationData);
    
    const randomRevenueResult = {
      ...result,
      simulation: true,
      randomGeneration: true,
      generatedAt: new Date().toISOString(),
      revenueRange: { minAmount, maxAmount },
      generatedAmount: randomRevenue
    };
    
    res.status(200).json({
      success: true,
      message: 'Random revenue generated and distributed successfully',
      data: randomRevenueResult
    });
    
  } catch (error) {
    logger.error('Error generating random revenue', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Failed to generate random revenue',
      details: error.message
    });
  }
});

module.exports = router;
