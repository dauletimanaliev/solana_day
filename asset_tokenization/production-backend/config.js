// ПРОДАКШЕН КОНФИГУРАЦИЯ
// ======================

module.exports = {
  // Solana настройки
  solana: {
    rpcUrl: process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com',
    network: process.env.SOLANA_NETWORK || 'devnet',
    walletPath: process.env.SOLANA_WALLET_PATH || '/Users/dauletimanaliev/.config/solana/id.json',
    programId: process.env.ANCHOR_PROGRAM_ID || 'FuAVoPCtaJWnJZVxE2ii4CtiqPwgvmxLE7gkGv5udmjQ'
  },
  
  // Сервер настройки
  server: {
    port: process.env.PORT || 3001,
    nodeEnv: process.env.NODE_ENV || 'production',
    logLevel: process.env.LOG_LEVEL || 'info'
  },
  
  // Безопасность
  security: {
    jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-here',
    apiKey: process.env.API_KEY || 'your-api-key-here'
  },
  
  // База данных
  database: {
    url: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/asset_tokenization'
  },
  
  // Мониторинг
  monitoring: {
    sentryDsn: process.env.SENTRY_DSN || 'your-sentry-dsn-here'
  }
};
