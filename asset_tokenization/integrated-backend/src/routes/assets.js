// ИНТЕГРИРОВАННЫЕ API РОУТЫ: Assets
// ==================================

const express = require('express');
const router = express.Router();
const { solanaService } = require('../config/solana');

// Создание актива
router.post('/create_asset', async (req, res) => {
  try {
    const { assetId, metadataUri, totalSupply, creator } = req.body;

    // Валидация
    if (!assetId || !metadataUri || !totalSupply || !creator) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: assetId, metadataUri, totalSupply, creator'
      });
    }

    // Вызов смарт-контракта
    const result = await solanaService.createAsset(
      parseInt(assetId),
      metadataUri,
      parseInt(totalSupply),
      creator
    );

    if (result.success) {
      res.json({
        success: true,
        message: 'Asset created successfully',
        data: {
          assetId: assetId,
          transaction: result.transaction,
          pdas: {
            asset: result.assetPda,
            escrow: result.escrowPda,
            revenuePool: result.revenuePoolPda
          }
        }
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error in create_asset:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Минтинг фракционных токенов
router.post('/mint_fraction', async (req, res) => {
  try {
    const { assetId, amount, creator } = req.body;

    // Валидация
    if (!assetId || !amount || !creator) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: assetId, amount, creator'
      });
    }

    // Вызов смарт-контракта
    const result = await solanaService.mintFractionTokens(
      parseInt(assetId),
      parseInt(amount),
      creator
    );

    if (result.success) {
      res.json({
        success: true,
        message: 'Fraction tokens minted successfully',
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
    console.error('Error in mint_fraction:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Получение информации об активе
router.get('/:assetId', async (req, res) => {
  try {
    const { assetId } = req.params;

    // Получаем информацию об активе
    const assetResult = await solanaService.getAssetInfo(parseInt(assetId));
    
    if (assetResult.success) {
      // Получаем дополнительную информацию
      const escrowResult = await solanaService.getEscrowInfo(parseInt(assetId));
      const revenueResult = await solanaService.getRevenuePoolInfo(parseInt(assetId));

      res.json({
        success: true,
        data: {
          asset: assetResult.asset,
          escrow: escrowResult.success ? escrowResult.escrow : null,
          revenuePool: revenueResult.success ? revenueResult.revenuePool : null
        }
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Asset not found'
      });
    }
  } catch (error) {
    console.error('Error in get asset:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Получение списка активов (mock данные для демонстрации)
router.get('/', async (req, res) => {
  try {
    // В реальном приложении здесь будет запрос к базе данных
    const mockAssets = [
      {
        id: "12345",
        name: "Люксовая квартира в Манхэттене",
        creator: "AP5FsMraMmpeytpBocRa4YyEgXANe8zFykPnwVq4aE8j",
        totalSupply: "1000000",
        remainingSupply: "750000",
        metadataUri: "https://example.com/metadata/12345.json",
        pricePerToken: "0.01",
        category: "real-estate"
      },
      {
        id: "67890",
        name: "Коллекция современного искусства",
        creator: "AP5FsMraMmpeytpBocRa4YyEgXANe8zFykPnwVq4aE8j",
        totalSupply: "500000",
        remainingSupply: "300000",
        metadataUri: "https://example.com/metadata/67890.json",
        pricePerToken: "0.005",
        category: "art"
      }
    ];

    res.json({
      success: true,
      data: mockAssets
    });
  } catch (error) {
    console.error('Error in get assets:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

module.exports = router;
