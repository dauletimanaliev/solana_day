// FRONTEND: Конфигурация для Frontend разработчика
// ================================================

// Program configuration
export const PROGRAM_CONFIG = {
  PROGRAM_ID: "FuAVoPCtaJWnJZVxE2ii4CtiqPwgvmxLE7gkGv5udmjQ",
  NETWORK: "devnet",
  RPC_URL: "https://api.devnet.solana.com",
  CLUSTER: "devnet"
};

// API endpoints
export const API_ENDPOINTS = {
  BASE_URL: "http://localhost:3001/api",
  ASSETS: "/assets",
  MINT: "/assets/:id/mint",
  BUY: "/assets/:id/buy",
  DISTRIBUTE: "/assets/:id/distribute"
};

// Error messages
export const ERROR_MESSAGES = {
  6000: "Недостаточно токенов для выпуска",
  6001: "Недостаточно токенов в эскроу",
  6002: "Неверная сумма",
  6003: "Неавторизованный доступ",
  NETWORK_ERROR: "Ошибка сети. Попробуйте позже.",
  WALLET_NOT_CONNECTED: "Кошелек не подключен",
  INVALID_INPUT: "Неверные данные"
};

// Transaction types
export const TRANSACTION_TYPES = {
  CREATE: "create",
  MINT: "mint", 
  BUY: "buy",
  DISTRIBUTE: "distribute"
};

// UI constants
export const UI_CONSTANTS = {
  MAX_ASSET_ID: 999999,
  MIN_TOTAL_SUPPLY: 1,
  MAX_TOTAL_SUPPLY: 1000000000,
  DECIMALS: 6
};
