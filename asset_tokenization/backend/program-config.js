// BACKEND: Конфигурация программы для Backend разработчика
// ========================================================

// Program ID
const PROGRAM_ID = "FuAVoPCtaJWnJZVxE2ii4CtiqPwgvmxLE7gkGv5udmjQ";

// Network configuration
const NETWORK = "devnet";
const RPC_URL = "https://api.devnet.solana.com";
const CLUSTER = "devnet";

// Seeds for PDA generation
const SEEDS = {
  ASSET: "asset",
  ESCROW: "escrow", 
  REVENUE_POOL: "revenue_pool"
};

// Error codes mapping
const ERROR_CODES = {
  6000: "InsufficientSupply",
  6001: "InsufficientTokenBalance",
  6002: "InvalidAmount", 
  6003: "Unauthorized"
};

// Instruction names
const INSTRUCTIONS = {
  CREATE_ASSET: "create_asset",
  MINT_FRACTION_TOKENS: "mint_fraction_tokens",
  BUY_FRACTIONS: "buy_fractions",
  DISTRIBUTE_REVENUE: "distribute_revenue"
};

module.exports = {
  PROGRAM_ID,
  NETWORK,
  RPC_URL,
  CLUSTER,
  SEEDS,
  ERROR_CODES,
  INSTRUCTIONS
};
