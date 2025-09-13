// ИНТЕГРИРОВАННЫЙ BACKEND СЕРВЕР
// ===============================

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const winston = require('winston');

// Импорт роутов
const assetsRoutes = require('./routes/assets');
const transactionsRoutes = require('./routes/transactions');

// Настройка логирования
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

const app = express();
const PORT = process.env.PORT || 3000;

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

// Логирование запросов
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Asset Tokenization API',
    version: '1.0.0'
  });
});

// API роуты
app.use('/api/assets', assetsRoutes);
app.use('/api/transactions', transactionsRoutes);

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
  logger.info(`🚀 Integrated Asset Tokenization API запущен на порту ${PORT}`);
  logger.info(`📋 Health check: http://localhost:${PORT}/health`);
  logger.info(`🔗 API endpoints:`);
  logger.info(`   POST /api/assets/create_asset`);
  logger.info(`   POST /api/assets/mint_fraction`);
  logger.info(`   GET  /api/assets/:assetId`);
  logger.info(`   GET  /api/assets`);
  logger.info(`   POST /api/transactions/buy_fraction`);
  logger.info(`   POST /api/transactions/distribute_revenue`);
});

module.exports = app;
