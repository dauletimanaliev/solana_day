-- Asset Tokenization Database Schema
-- =================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    wallet_address TEXT UNIQUE NOT NULL,
    username TEXT,
    email TEXT,
    avatar_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Assets table
CREATE TABLE IF NOT EXISTS assets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    asset_id TEXT UNIQUE NOT NULL,
    creator_address TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    metadata_uri TEXT,
    total_supply INTEGER NOT NULL,
    remaining_supply INTEGER NOT NULL,
    price_per_token REAL NOT NULL,
    category TEXT,
    project_type TEXT DEFAULT 'both',
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (creator_address) REFERENCES users(wallet_address)
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    transaction_id TEXT UNIQUE NOT NULL,
    asset_id TEXT NOT NULL,
    buyer_address TEXT NOT NULL,
    seller_address TEXT,
    amount INTEGER NOT NULL,
    price_per_token REAL NOT NULL,
    total_amount REAL NOT NULL,
    transaction_type TEXT NOT NULL, -- 'buy', 'sell', 'mint', 'create'
    status TEXT DEFAULT 'pending',
    solana_tx_hash TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (asset_id) REFERENCES assets(asset_id),
    FOREIGN KEY (buyer_address) REFERENCES users(wallet_address)
);

-- Market offers table
CREATE TABLE IF NOT EXISTS market_offers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    offer_id TEXT UNIQUE NOT NULL,
    asset_id TEXT NOT NULL,
    seller_address TEXT NOT NULL,
    amount INTEGER NOT NULL,
    price_per_token REAL NOT NULL,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME,
    FOREIGN KEY (asset_id) REFERENCES assets(asset_id),
    FOREIGN KEY (seller_address) REFERENCES users(wallet_address)
);

-- Revenue distributions table
CREATE TABLE IF NOT EXISTS revenue_distributions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    distribution_id TEXT UNIQUE NOT NULL,
    asset_id TEXT NOT NULL,
    creator_address TEXT NOT NULL,
    total_revenue REAL NOT NULL,
    distribution_per_token REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (asset_id) REFERENCES assets(asset_id),
    FOREIGN KEY (creator_address) REFERENCES users(wallet_address)
);

-- Token holders table (for dividend tracking)
CREATE TABLE IF NOT EXISTS token_holders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    asset_id TEXT NOT NULL,
    holder_address TEXT NOT NULL,
    token_amount INTEGER NOT NULL,
    percentage REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (asset_id) REFERENCES assets(asset_id),
    FOREIGN KEY (holder_address) REFERENCES users(wallet_address),
    UNIQUE(asset_id, holder_address)
);

-- Dividend payments table
CREATE TABLE IF NOT EXISTS dividend_payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    payment_id TEXT UNIQUE NOT NULL,
    asset_id TEXT NOT NULL,
    holder_address TEXT NOT NULL,
    amount REAL NOT NULL,
    token_amount INTEGER NOT NULL,
    percentage REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    solana_tx_hash TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (asset_id) REFERENCES assets(asset_id),
    FOREIGN KEY (holder_address) REFERENCES users(wallet_address)
);

-- Analytics table
CREATE TABLE IF NOT EXISTS analytics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE NOT NULL,
    total_assets INTEGER DEFAULT 0,
    total_volume REAL DEFAULT 0,
    total_users INTEGER DEFAULT 0,
    total_transactions INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_assets_creator ON assets(creator_address);
CREATE INDEX IF NOT EXISTS idx_assets_category ON assets(category);
CREATE INDEX IF NOT EXISTS idx_transactions_asset ON transactions(asset_id);
CREATE INDEX IF NOT EXISTS idx_transactions_buyer ON transactions(buyer_address);
CREATE INDEX IF NOT EXISTS idx_market_offers_asset ON market_offers(asset_id);
CREATE INDEX IF NOT EXISTS idx_analytics_date ON analytics(date);
