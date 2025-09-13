// Analytics Routes
// ================

const express = require('express');
const router = express.Router();

// Get platform analytics
router.get('/', async (req, res) => {
    try {
        const db = req.app.get('db');
        
        // Get total assets count
        const assetsResult = await db.get(`
            SELECT COUNT(*) as total_assets 
            FROM assets 
            WHERE status = 'active'
        `);
        
        // Get total volume (sum of all transactions)
        const volumeResult = await db.get(`
            SELECT COALESCE(SUM(amount), 0) as total_volume 
            FROM transactions 
            WHERE status = 'completed'
        `);
        
        // Get total users count
        const usersResult = await db.get(`
            SELECT COUNT(DISTINCT creator_address) as total_users 
            FROM assets 
            WHERE status = 'active'
        `);
        
        // Get total participants (unique users who made transactions)
        const participantsResult = await db.get(`
            SELECT COUNT(DISTINCT buyer_address) as total_participants 
            FROM transactions 
            WHERE status = 'completed'
        `);
        
        // Get total dividends paid
        const dividendsResult = await db.get(`
            SELECT COALESCE(SUM(amount), 0) as total_dividends 
            FROM dividend_payments 
            WHERE status = 'completed'
        `);
        
        // Calculate lives changed (based on volume * multiplier)
        const livesChanged = Math.floor((volumeResult.total_volume || 0) * 1000);
        
        res.json({
            success: true,
            data: {
                total_assets: assetsResult.total_assets || 0,
                total_volume: volumeResult.total_volume || 0,
                total_users: usersResult.total_users || 0,
                total_participants: participantsResult.total_participants || 0,
                total_dividends: dividendsResult.total_dividends || 0,
                total_impact: livesChanged
            }
        });
        
    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to load analytics'
        });
    }
});

// Get asset analytics
router.get('/asset/:assetId', async (req, res) => {
    try {
        const db = req.app.get('db');
        const { assetId } = req.params;
        
        // Get asset details
        const asset = await db.get(`
            SELECT * FROM assets WHERE asset_id = ?
        `, [assetId]);
        
        if (!asset) {
            return res.status(404).json({
                success: false,
                error: 'Asset not found'
            });
        }
        
        // Get transaction stats for this asset
        const stats = await db.get(`
            SELECT 
                COUNT(*) as total_transactions,
                COALESCE(SUM(amount), 0) as total_volume,
                COUNT(DISTINCT user_address) as unique_buyers
            FROM transactions 
            WHERE asset_id = ? AND status = 'completed'
        `, [assetId]);
        
        res.json({
            success: true,
            data: {
                asset: asset,
                stats: stats
            }
        });
        
    } catch (error) {
        console.error('Asset analytics error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to load asset analytics'
        });
    }
});

module.exports = router;
