// Production Backend Server
// =========================

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const Database = require('./database/database');
const assetRoutes = require('./routes/assets');
const transactionRoutes = require('./routes/transactions');
const analyticsRoutes = require('./routes/analytics');
const dividendRoutes = require('./routes/dividends');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Database initialization
const db = new Database();

// Make database available to routes
app.set('db', db);

// Routes
app.use('/api/assets', assetRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/dividends', dividendRoutes);

// Health check
app.get('/health', async (req, res) => {
    try {
        // Check database connection
        const testQuery = await db.get('SELECT 1 as test');
        
        res.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            service: 'Asset Tokenization API (Production)',
            version: '1.0.0',
            database: 'connected',
            uptime: process.uptime()
        });
    } catch (error) {
        res.status(500).json({
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            error: error.message
        });
    }
});

// Analytics endpoint
app.get('/api/analytics', async (req, res) => {
    try {
        const analytics = await db.get(`
            SELECT * FROM analytics 
            WHERE date = date('now')
        `);
        
        res.json({
            success: true,
            data: analytics || {
                total_assets: 0,
                total_volume: 0,
                total_users: 0,
                total_transactions: 0
            }
        });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch analytics'
        });
    }
});

// Categories endpoint
app.get('/api/categories', async (req, res) => {
    try {
        const categories = await db.all(`
            SELECT category, COUNT(*) as count
            FROM assets 
            WHERE status = 'active'
            GROUP BY category
            ORDER BY count DESC
        `);
        
        res.json({
            success: true,
            data: categories
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch categories'
        });
    }
});

// Search endpoint
app.get('/api/search', async (req, res) => {
    try {
        const { q, category, min_price, max_price } = req.query;
        
        let sql = `
            SELECT a.*, u.username as creator_name, u.avatar_url as creator_avatar
            FROM assets a
            LEFT JOIN users u ON a.creator_address = u.wallet_address
            WHERE a.status = 'active'
        `;
        
        const params = [];
        
        if (q) {
            sql += ' AND (a.name LIKE ? OR a.description LIKE ?)';
            params.push(`%${q}%`, `%${q}%`);
        }
        
        if (category) {
            sql += ' AND a.category = ?';
            params.push(category);
        }
        
        if (min_price) {
            sql += ' AND a.price_per_token >= ?';
            params.push(parseFloat(min_price));
        }
        
        if (max_price) {
            sql += ' AND a.price_per_token <= ?';
            params.push(parseFloat(max_price));
        }
        
        sql += ' ORDER BY a.created_at DESC';
        
        const results = await db.all(sql, params);
        
        res.json({
            success: true,
            data: results,
            query: { q, category, min_price, max_price }
        });
    } catch (error) {
        console.error('Error searching assets:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to search assets'
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found'
    });
});

// Start server
async function startServer() {
    try {
        await db.init();
        console.log('✅ Database initialized successfully');
        
        app.listen(PORT, () => {
            console.log(`🚀 Production server running on http://localhost:${PORT}`);
            console.log(`📊 Health check: http://localhost:${PORT}/health`);
            console.log(`🔗 API endpoints:`);
            console.log(`   - Assets: http://localhost:${PORT}/api/assets`);
            console.log(`   - Transactions: http://localhost:${PORT}/api/transactions`);
            console.log(`   - Analytics: http://localhost:${PORT}/api/analytics`);
            console.log(`   - Search: http://localhost:${PORT}/api/search`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down server...');
    db.close();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Shutting down server...');
    db.close();
    process.exit(0);
});

startServer();