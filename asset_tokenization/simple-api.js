// УПРОЩЕННЫЙ API ДЛЯ ДЕМОНСТРАЦИИ
// ===============================

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Asset Tokenization API (Demo)',
    version: '1.0.0'
  });
});

// Создание актива (mock)
app.post('/api/assets/create_asset', (req, res) => {
  const { assetId, metadataUri, totalSupply, creator } = req.body;
  
  console.log('📝 Creating asset:', { assetId, metadataUri, totalSupply, creator });
  
  res.json({
    success: true,
    message: 'Asset created successfully (mock)',
    data: {
      assetId: assetId,
      transaction: 'mock_transaction_' + Date.now(),
      pdas: {
        asset: 'mock_asset_pda_' + assetId,
        escrow: 'mock_escrow_pda_' + assetId,
        revenuePool: 'mock_revenue_pool_pda_' + assetId
      }
    }
  });
});

// Минтинг токенов (mock)
app.post('/api/assets/mint_fraction', (req, res) => {
  const { assetId, amount, creator } = req.body;
  
  console.log('🪙 Minting tokens:', { assetId, amount, creator });
  
  res.json({
    success: true,
    message: 'Fraction tokens minted successfully (mock)',
    data: {
      assetId: assetId,
      amount: amount,
      transaction: 'mock_mint_transaction_' + Date.now()
    }
  });
});

// Покупка фракций (mock)
app.post('/api/transactions/buy_fraction', (req, res) => {
  const { assetId, amount, buyer } = req.body;
  
  console.log('💰 Buying fractions:', { assetId, amount, buyer });
  
  res.json({
    success: true,
    message: 'Fractions purchased successfully (mock)',
    data: {
      assetId: assetId,
      amount: amount,
      transaction: 'mock_buy_transaction_' + Date.now()
    }
  });
});

// Распределение дохода (mock)
app.post('/api/transactions/distribute_revenue', (req, res) => {
  const { assetId, amount, creator } = req.body;
  
  console.log('💸 Distributing revenue:', { assetId, amount, creator });
  
  res.json({
    success: true,
    message: 'Revenue distributed successfully (mock)',
    data: {
      assetId: assetId,
      amount: amount,
      transaction: 'mock_distribute_transaction_' + Date.now()
    }
  });
});

// Получение информации об активе (mock)
app.get('/api/assets/:assetId', (req, res) => {
  const { assetId } = req.params;
  
  console.log('📋 Getting asset info:', assetId);
  
  res.json({
    success: true,
    data: {
      asset: {
        id: assetId,
        creator: 'AP5FsMraMmpeytpBocRa4YyEgXANe8zFykPnwVq4aE8j',
        metadataUri: 'https://example.com/metadata/' + assetId + '.json',
        totalSupply: '1000000',
        remainingSupply: '750000',
        bump: 255
      },
      escrow: {
        assetId: assetId,
        totalAmount: '1000000',
        availableAmount: '750000'
      },
      revenuePool: {
        assetId: assetId,
        totalRevenue: '50000',
        distributedRevenue: '25000'
      }
    }
  });
});

// Получение списка активов (mock)
app.get('/api/assets', (req, res) => {
  console.log('📋 Getting assets list');
  
  res.json({
    success: true,
    data: [
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
    ]
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Simple Asset Tokenization API запущен на порту ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API endpoints:`);
  console.log(`   POST /api/assets/create_asset`);
  console.log(`   POST /api/assets/mint_fraction`);
  console.log(`   GET  /api/assets/:assetId`);
  console.log(`   GET  /api/assets`);
  console.log(`   POST /api/transactions/buy_fraction`);
  console.log(`   POST /api/transactions/distribute_revenue`);
  console.log(`\n🎯 Готово для тестирования!`);
});
