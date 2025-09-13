// Database Manager
// ================

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

class Database {
    constructor() {
        this.db = null;
        this.dbPath = path.join(__dirname, 'tokenization.db');
    }

    async init() {
        return new Promise((resolve, reject) => {
            this.db = new sqlite3.Database(this.dbPath, (err) => {
                if (err) {
                    console.error('❌ Database connection failed:', err.message);
                    reject(err);
                } else {
                    console.log('✅ Connected to SQLite database');
                    this.createTables().then(resolve).catch(reject);
                }
            });
        });
    }

    async createTables() {
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        return new Promise((resolve, reject) => {
            this.db.exec(schema, (err) => {
                if (err) {
                    console.error('❌ Schema creation failed:', err.message);
                    reject(err);
                } else {
                    console.log('✅ Database tables created successfully');
                    this.seedData().then(resolve).catch(reject);
                }
            });
        });
    }

    async seedData() {
        // Seed initial data for demo
        const sampleAssets = [
            {
                asset_id: 'ASSET_001',
                creator_address: 'AP5FsMraMmpeytpBocRa4YyEgXANe8zFykPnwVq4aE8j',
                name: 'Real Estate Token #1',
                description: 'Токенизированная недвижимость в центре города',
                image_url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400',
                metadata_uri: 'https://api.example.com/metadata/ASSET_001',
                total_supply: 1000000,
                remaining_supply: 800000,
                price_per_token: 0.001,
                category: 'real_estate'
            },
            {
                asset_id: 'ASSET_002',
                creator_address: 'AP5FsMraMmpeytpBocRa4YyEgXANe8zFykPnwVq4aE8j',
                name: 'Art Collection #1',
                description: 'Коллекция цифрового искусства',
                image_url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400',
                metadata_uri: 'https://api.example.com/metadata/ASSET_002',
                total_supply: 500000,
                remaining_supply: 300000,
                price_per_token: 0.002,
                category: 'art'
            },
            {
                asset_id: 'ASSET_003',
                creator_address: 'AP5FsMraMmpeytpBocRa4YyEgXANe8zFykPnwVq4aE8j',
                name: 'Startup Equity #1',
                description: 'Доля в технологическом стартапе',
                image_url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400',
                metadata_uri: 'https://api.example.com/metadata/ASSET_003',
                total_supply: 2000000,
                remaining_supply: 1500000,
                price_per_token: 0.005,
                category: 'equity'
            }
        ];

        const sampleUsers = [
            {
                wallet_address: 'AP5FsMraMmpeytpBocRa4YyEgXANe8zFykPnwVq4aE8j',
                username: 'Creator1',
                email: 'creator1@example.com',
                avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'
            },
            {
                wallet_address: 'BQ6GtMraMmpeytpBocRa4YyEgXANe8zFykPnwVq4aE8k',
                username: 'Investor1',
                email: 'investor1@example.com',
                avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
            }
        ];

        // Insert sample data
        for (const user of sampleUsers) {
            await this.run(`
                INSERT OR IGNORE INTO users (wallet_address, username, email, avatar_url)
                VALUES (?, ?, ?, ?)
            `, [user.wallet_address, user.username, user.email, user.avatar_url]);
        }

        for (const asset of sampleAssets) {
            await this.run(`
                INSERT OR IGNORE INTO assets (asset_id, creator_address, name, description, image_url, metadata_uri, total_supply, remaining_supply, price_per_token, category)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [asset.asset_id, asset.creator_address, asset.name, asset.description, asset.image_url, asset.metadata_uri, asset.total_supply, asset.remaining_supply, asset.price_per_token, asset.category]);
        }

        // Insert analytics data
        await this.run(`
            INSERT OR IGNORE INTO analytics (date, total_assets, total_volume, total_users, total_transactions)
            VALUES (date('now'), 3, 1.5, 2, 0)
        `);

        console.log('✅ Sample data seeded successfully');
    }

    run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, changes: this.changes });
                }
            });
        });
    }

    get(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    all(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    close() {
        if (this.db) {
            this.db.close();
        }
    }
}

module.exports = Database;
