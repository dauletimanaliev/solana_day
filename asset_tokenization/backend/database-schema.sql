-- BACKEND: Схема базы данных для Asset Tokenization
-- ================================================

-- Таблица активов
CREATE TABLE assets (
  id SERIAL PRIMARY KEY,
  asset_id BIGINT UNIQUE NOT NULL,
  creator_address VARCHAR(44) NOT NULL,
  metadata_uri TEXT NOT NULL,
  total_supply BIGINT NOT NULL,
  pda_address VARCHAR(44) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Таблица транзакций
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  asset_id BIGINT REFERENCES assets(asset_id),
  user_address VARCHAR(44) NOT NULL,
  amount BIGINT NOT NULL,
  transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('create', 'mint', 'buy', 'distribute')),
  tx_signature VARCHAR(88) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Таблица владельцев фракций
CREATE TABLE fraction_owners (
  id SERIAL PRIMARY KEY,
  asset_id BIGINT REFERENCES assets(asset_id),
  owner_address VARCHAR(44) NOT NULL,
  fraction_amount BIGINT NOT NULL,
  percentage DECIMAL(5,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(asset_id, owner_address)
);

-- Таблица доходов
CREATE TABLE revenue_distributions (
  id SERIAL PRIMARY KEY,
  asset_id BIGINT REFERENCES assets(asset_id),
  amount BIGINT NOT NULL,
  distributed_by VARCHAR(44) NOT NULL,
  tx_signature VARCHAR(88) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Индексы для оптимизации
CREATE INDEX idx_assets_asset_id ON assets(asset_id);
CREATE INDEX idx_assets_creator ON assets(creator_address);
CREATE INDEX idx_transactions_asset_id ON transactions(asset_id);
CREATE INDEX idx_transactions_user ON transactions(user_address);
CREATE INDEX idx_fraction_owners_asset ON fraction_owners(asset_id);
CREATE INDEX idx_fraction_owners_owner ON fraction_owners(owner_address);
CREATE INDEX idx_revenue_asset_id ON revenue_distributions(asset_id);

-- Триггеры для обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_assets_updated_at 
  BEFORE UPDATE ON assets 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fraction_owners_updated_at 
  BEFORE UPDATE ON fraction_owners 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
