// ИНТЕГРИРОВАННЫЕ API РОУТЫ: Transactions
// =======================================

const express = require('express');
const router = express.Router();
const { solanaService } = require('../config/solana');

// Покупка фракций
router.post('/buy_fraction', async (req, res) => {
  try {
    const { assetId, amount, buyer } = req.body;

    if (!assetId || !amount || !buyer) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: assetId, amount, buyer'
      });
    }

    const result = await solanaService.buyFractions(
      parseInt(assetId),
      parseInt(amount),
      buyer
    );

    if (result.success) {
      res.json({
        success: true,
        message: 'Fractions purchased successfully',
        data: {
          assetId: assetId,
          amount: amount,
          transaction: result.transaction
        }
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error in buy_fraction:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Распределение дохода
router.post('/distribute_revenue', async (req, res) => {
  try {
    const { assetId, amount, creator } = req.body;

    if (!assetId || !amount || !creator) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: assetId, amount, creator'
      });
    }

    const result = await solanaService.distributeRevenue(
      parseInt(assetId),
      parseInt(amount),
      creator
    );

    if (result.success) {
      res.json({
        success: true,
        message: 'Revenue distributed successfully',
        data: {
          assetId: assetId,
          amount: amount,
          transaction: result.transaction
        }
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error in distribute_revenue:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

module.exports = router;
