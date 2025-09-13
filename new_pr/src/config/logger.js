const winston = require('winston');
const path = require('path');

// Create logs directory if it doesn't exist
const logDir = path.join(__dirname, '../../logs');
require('fs').mkdirSync(logDir, { recursive: true });

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'solana-fractional-assets' },
  transports: [
    // Write all logs with importance level of `error` or less to `error.log`
    new winston.transports.File({ 
      filename: path.join(logDir, 'error.log'), 
      level: 'error' 
    }),
    // Write all logs with importance level of `info` or less to `combined.log`
    new winston.transports.File({ 
      filename: path.join(logDir, 'combined.log') 
    }),
  ],
});

// If we're not in production, log to the console as well
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

// Helper function for logging transaction results
const logTransactionResult = (operation, result) => {
  logger.info('Transaction Result', {
    operation,
    success: result.success,
    signature: result.signature,
    tokensTransferred: result.tokensTransferred,
    revenueDistributed: result.revenueDistributed,
    timestamp: new Date().toISOString()
  });
};

// Helper function for logging errors
const logError = (operation, error) => {
  logger.error('Transaction Error', {
    operation,
    error: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  logger,
  logTransactionResult,
  logError
};
