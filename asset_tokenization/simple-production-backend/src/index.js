// ПРОСТАЯ ПРОДАКШЕН ВЕРСИЯ - Asset Tokenization Platform
// =====================================================

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const winston = require('winston');
const { Connection, PublicKey, Keypair } = require('@solana/web3.js');

// Настройка логирования
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100 // максимум 100 запросов с одного IP
});
app.use(limiter);

// Подключение к Solana
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

// Загружаем кошелек
let wallet;
try {
  const fs = require('fs');
  const path = require('path');
  const walletPath = process.env.HOME + '/.config/solana/id.json';
  const walletData = JSON.parse(fs.readFileSync(walletPath, 'utf8'));
  wallet = Keypair.fromSecretKey(new Uint8Array(walletData));
  logger.info('✅ Кошелек загружен:', wallet.publicKey.toString());
} catch (error) {
  logger.error('❌ Ошибка загрузки кошелька:', error.message);
  // Создаем временный кошелек для демо
  wallet = Keypair.generate();
  logger.info('✅ Временный кошелек создан:', wallet.publicKey.toString());
}

// Логирование запросов
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  next();
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Asset Tokenization API (Production)',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      createAsset: 'POST /api/assets/create_asset',
      mintFraction: 'POST /api/assets/mint_fraction',
      getAsset: 'GET /api/assets/:assetId',
      listAssets: 'GET /api/assets',
      buyFraction: 'POST /api/transactions/buy_fraction',
      distributeRevenue: 'POST /api/transactions/distribute_revenue',
      getTransaction: 'GET /api/transactions/:transactionId'
    },
    documentation: 'https://github.com/your-repo/asset-tokenization',
    status: 'running'
  });
});

// Health check
app.get('/health', async (req, res) => {
  try {
    const version = await connection.getVersion();
    const balance = await connection.getBalance(wallet.publicKey);
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'Asset Tokenization API (Production)',
      version: '1.0.0',
      solana: {
        success: true,
        version: version,
        balance: balance / 1e9,
        wallet: wallet.publicKey.toString()
      }
    });
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(500).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});

// Создание актива (симуляция)
app.post('/api/assets/create_asset', async (req, res) => {
  try {
    const { assetId, metadataUri, totalSupply, creator } = req.body;

    // Валидация
    if (!assetId || !metadataUri || !totalSupply || !creator) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: assetId, metadataUri, totalSupply, creator'
      });
    }

    // Проверяем, что creator - валидный PublicKey
    try {
      new PublicKey(creator);
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'Invalid creator public key'
      });
    }

    // Симулируем создание актива
    const mockTransaction = 'mock_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    res.json({
      success: true,
      message: 'Asset created successfully (simulated)',
      data: {
        assetId: assetId,
        transaction: mockTransaction,
        pdas: {
          asset: 'mock_asset_' + assetId,
          escrow: 'mock_escrow_' + assetId,
          revenuePool: 'mock_revenue_pool_' + assetId
        },
        explorer: `https://explorer.solana.com/tx/${mockTransaction}?cluster=devnet`
      }
    });
  } catch (error) {
    logger.error('Error in create_asset:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Минтинг фракционных токенов (симуляция)
app.post('/api/assets/mint_fraction', async (req, res) => {
  try {
    const { assetId, amount, creator } = req.body;

    // Валидация
    if (!assetId || !amount || !creator) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: assetId, amount, creator'
      });
    }

    // Симулируем минтинг
    const mockTransaction = 'mock_mint_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    res.json({
      success: true,
      message: 'Fraction tokens minted successfully (simulated)',
      data: {
        assetId: assetId,
        amount: amount,
        transaction: mockTransaction,
        explorer: `https://explorer.solana.com/tx/${mockTransaction}?cluster=devnet`
      }
    });
  } catch (error) {
    logger.error('Error in mint_fraction:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Покупка фракций (симуляция)
app.post('/api/transactions/buy_fraction', async (req, res) => {
  try {
    const { assetId, amount, buyer } = req.body;

    // Валидация
    if (!assetId || !amount || !buyer) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: assetId, amount, buyer'
      });
    }

    // Проверяем, что buyer - валидный PublicKey
    try {
      new PublicKey(buyer);
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'Invalid buyer public key'
      });
    }

    // Симулируем покупку
    const mockTransaction = 'mock_buy_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    res.json({
      success: true,
      message: 'Fractions purchased successfully (simulated)',
      data: {
        assetId: assetId,
        amount: amount,
        transaction: mockTransaction,
        explorer: `https://explorer.solana.com/tx/${mockTransaction}?cluster=devnet`
      }
    });
  } catch (error) {
    logger.error('Error in buy_fraction:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Распределение дохода (симуляция)
app.post('/api/transactions/distribute_revenue', async (req, res) => {
  try {
    const { assetId, amount, creator } = req.body;

    // Валидация
    if (!assetId || !amount || !creator) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: assetId, amount, creator'
      });
    }

    // Проверяем, что creator - валидный PublicKey
    try {
      new PublicKey(creator);
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'Invalid creator public key'
      });
    }

    // Симулируем распределение
    const mockTransaction = 'mock_distribute_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    res.json({
      success: true,
      message: 'Revenue distributed successfully (simulated)',
      data: {
        assetId: assetId,
        amount: amount,
        transaction: mockTransaction,
        explorer: `https://explorer.solana.com/tx/${mockTransaction}?cluster=devnet`
      }
    });
  } catch (error) {
    logger.error('Error in distribute_revenue:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Получение информации об активе (симуляция)
app.get('/api/assets/:assetId', async (req, res) => {
  try {
    const { assetId } = req.params;

    // Симулируем данные актива
    const mockAsset = {
      id: assetId,
      creator: wallet.publicKey.toString(),
      metadataUri: `https://example.com/metadata/${assetId}.json`,
      totalSupply: '1000000',
      remainingSupply: '800000',
      bump: 255
    };

    res.json({
      success: true,
      data: {
        asset: mockAsset,
        escrow: {
          assetId: assetId,
          totalAmount: '1000000',
          availableAmount: '800000'
        },
        revenuePool: {
          assetId: assetId,
          totalRevenue: '50000',
          distributedRevenue: '10000'
        }
      }
    });
  } catch (error) {
    logger.error('Error in get asset:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Получение списка активов (симуляция)
app.get('/api/assets', async (req, res) => {
  try {
    // Симулируем список активов
    const mockAssets = [
      {
        id: '12345',
        creator: wallet.publicKey.toString(),
        metadataUri: 'https://example.com/metadata/12345.json',
        totalSupply: '1000000',
        remainingSupply: '800000'
      },
      {
        id: '67890',
        creator: wallet.publicKey.toString(),
        metadataUri: 'https://example.com/metadata/67890.json',
        totalSupply: '500000',
        remainingSupply: '300000'
      }
    ];

    res.json({
      success: true,
      data: mockAssets
    });
  } catch (error) {
    logger.error('Error in get assets:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Получение информации о транзакции (симуляция)
app.get('/api/transactions/:transactionId', async (req, res) => {
  try {
    const { transactionId } = req.params;
    
    // Симулируем данные транзакции
    const mockTransaction = {
      transactionId: transactionId,
      slot: Math.floor(Math.random() * 1000000),
      blockTime: Math.floor(Date.now() / 1000),
      fee: Math.floor(Math.random() * 10000),
      status: 'success',
      logs: [
        'Program 11111111111111111111111111111111 invoke [1]',
        'Program log: Instruction: CreateAsset',
        'Program 11111111111111111111111111111111 success'
      ],
      explorer: `https://explorer.solana.com/tx/${transactionId}?cluster=devnet`
    };

    res.json({
      success: true,
      data: mockTransaction
    });
  } catch (error) {
    logger.error('Error in get transaction:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Обработка ошибок
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Запуск сервера
app.listen(PORT, () => {
  logger.info(`🚀 Simple Production Asset Tokenization API запущен на порту ${PORT}`);
  logger.info(`📋 Health check: http://localhost:${PORT}/health`);
  logger.info(`🔗 API endpoints:`);
  logger.info(`   POST /api/assets/create_asset`);
  logger.info(`   POST /api/assets/mint_fraction`);
  logger.info(`   GET  /api/assets/:assetId`);
  logger.info(`   GET  /api/assets`);
  logger.info(`   POST /api/transactions/buy_fraction`);
  logger.info(`   POST /api/transactions/distribute_revenue`);
  logger.info(`   GET  /api/transactions/:transactionId`);
  logger.info(`\n🎯 Готов к работе с симулированными данными!`);
});

module.exports = app;
