// Dividends Routes
// ================

const express = require('express');
const router = express.Router();

// Distribute dividends to token holders
router.post('/distribute', async (req, res) => {
    try {
        const db = req.app.get('db');
        const { asset_id, total_revenue, creator_address } = req.body;
        
        // Validate required fields
        if (!asset_id || !total_revenue || !creator_address) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }
        
        // Get asset details
        const asset = await db.get(`
            SELECT * FROM assets WHERE asset_id = ? AND creator_address = ?
        `, [asset_id, creator_address]);
        
        if (!asset) {
            return res.status(404).json({
                success: false,
                error: 'Asset not found or unauthorized'
            });
        }
        
        // Get all token holders for this asset
        const holders = await db.all(`
            SELECT * FROM token_holders WHERE asset_id = ? ORDER BY token_amount DESC
        `, [asset_id]);
        
        if (holders.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'No token holders found for this asset'
            });
        }
        
        const distributionId = `DIV_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const distributionPerToken = total_revenue / asset.total_supply;
        
        // Create distribution record
        await db.run(`
            INSERT INTO revenue_distributions (distribution_id, asset_id, creator_address, total_revenue, distribution_per_token, status)
            VALUES (?, ?, ?, ?, ?, 'pending')
        `, [distributionId, asset_id, creator_address, total_revenue, distributionPerToken]);
        
        // Calculate and create dividend payments for each holder
        const payments = [];
        for (const holder of holders) {
            const paymentAmount = holder.token_amount * distributionPerToken;
            const paymentId = `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            
            await db.run(`
                INSERT INTO dividend_payments (payment_id, asset_id, holder_address, amount, token_amount, percentage, status)
                VALUES (?, ?, ?, ?, ?, ?, 'pending')
            `, [paymentId, asset_id, holder.holder_address, paymentAmount, holder.token_amount, holder.percentage]);
            
            payments.push({
                payment_id: paymentId,
                holder_address: holder.holder_address,
                amount: paymentAmount,
                token_amount: holder.token_amount,
                percentage: holder.percentage
            });
        }
        
        res.json({
            success: true,
            data: {
                distribution_id: distributionId,
                asset_id: asset_id,
                total_revenue: total_revenue,
                distribution_per_token: distributionPerToken,
                total_holders: holders.length,
                payments: payments
            }
        });
        
    } catch (error) {
        console.error('Dividend distribution error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to distribute dividends'
        });
    }
});

// Get dividend history for an asset
router.get('/asset/:assetId', async (req, res) => {
    try {
        const db = req.app.get('db');
        const { assetId } = req.params;
        
        const distributions = await db.all(`
            SELECT rd.*, a.name as asset_name
            FROM revenue_distributions rd
            JOIN assets a ON rd.asset_id = a.asset_id
            WHERE rd.asset_id = ?
            ORDER BY rd.created_at DESC
        `, [assetId]);
        
        res.json({
            success: true,
            data: distributions
        });
        
    } catch (error) {
        console.error('Dividend history error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to load dividend history'
        });
    }
});

// Get dividend payments for a user
router.get('/user/:address', async (req, res) => {
    try {
        const db = req.app.get('db');
        const { address } = req.params;
        
        const payments = await db.all(`
            SELECT dp.*, a.name as asset_name, a.image_url
            FROM dividend_payments dp
            JOIN assets a ON dp.asset_id = a.asset_id
            WHERE dp.holder_address = ?
            ORDER BY dp.created_at DESC
        `, [address]);
        
        res.json({
            success: true,
            data: payments
        });
        
    } catch (error) {
        console.error('User dividend payments error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to load user dividend payments'
        });
    }
});

// Update token holder balance (called when tokens are bought/sold)
router.post('/update-holder', async (req, res) => {
    try {
        const db = req.app.get('db');
        const { asset_id, holder_address, token_amount, transaction_type } = req.body;
        
        // Get asset total supply
        const asset = await db.get(`
            SELECT total_supply FROM assets WHERE asset_id = ?
        `, [asset_id]);
        
        if (!asset) {
            return res.status(404).json({
                success: false,
                error: 'Asset not found'
            });
        }
        
        const percentage = (token_amount / asset.total_supply) * 100;
        
        if (transaction_type === 'buy' || transaction_type === 'mint') {
            // Add or update token holder
            await db.run(`
                INSERT OR REPLACE INTO token_holders (asset_id, holder_address, token_amount, percentage, updated_at)
                VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
            `, [asset_id, holder_address, token_amount, percentage]);
        } else if (transaction_type === 'sell') {
            // Update or remove token holder
            if (token_amount > 0) {
                await db.run(`
                    INSERT OR REPLACE INTO token_holders (asset_id, holder_address, token_amount, percentage, updated_at)
                    VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
                `, [asset_id, holder_address, token_amount, percentage]);
            } else {
                // Remove holder if no tokens left
                await db.run(`
                    DELETE FROM token_holders WHERE asset_id = ? AND holder_address = ?
                `, [asset_id, holder_address]);
            }
        }
        
        res.json({
            success: true,
            data: {
                asset_id: asset_id,
                holder_address: holder_address,
                token_amount: token_amount,
                percentage: percentage
            }
        });
        
    } catch (error) {
        console.error('Update holder error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update token holder'
        });
    }
});

module.exports = router;
