// Assets API Routes
// =================

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// Get all assets
router.get('/', async (req, res) => {
    try {
        const db = req.app.get('db');
        const { category, limit = 20, offset = 0 } = req.query;
        
        let sql = `
            SELECT a.*, u.username as creator_name, u.avatar_url as creator_avatar
            FROM assets a
            LEFT JOIN users u ON a.creator_address = u.wallet_address
            WHERE a.status = 'active'
        `;
        
        const params = [];
        if (category) {
            sql += ' AND a.category = ?';
            params.push(category);
        }
        
        sql += ' ORDER BY a.created_at DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));
        
        const assets = await db.all(sql, params);
        
        res.json({
            success: true,
            data: assets,
            pagination: {
                limit: parseInt(limit),
                offset: parseInt(offset),
                total: assets.length
            }
        });
    } catch (error) {
        console.error('Error fetching assets:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch assets'
        });
    }
});

// Get single asset
router.get('/:assetId', async (req, res) => {
    try {
        const db = req.app.get('db');
        const { assetId } = req.params;
        
        const asset = await db.get(`
            SELECT a.*, u.username as creator_name, u.avatar_url as creator_avatar
            FROM assets a
            LEFT JOIN users u ON a.creator_address = u.wallet_address
            WHERE a.asset_id = ? AND a.status = 'active'
        `, [assetId]);
        
        if (!asset) {
            return res.status(404).json({
                success: false,
                error: 'Asset not found'
            });
        }
        
        res.json({
            success: true,
            data: asset
        });
    } catch (error) {
        console.error('Error fetching asset:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch asset'
        });
    }
});

// Create new asset
router.post('/create', async (req, res) => {
    try {
        const db = req.app.get('db');
        const {
            name,
            description,
            image_url,
            metadata_uri,
            total_supply,
            price_per_token,
            category,
            project_type,
            creator_address
        } = req.body;
        
        // Validate required fields
        if (!name || !total_supply || !price_per_token || !creator_address) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }
        
        const assetId = `ASSET_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const result = await db.run(`
            INSERT INTO assets (asset_id, creator_address, name, description, image_url, metadata_uri, total_supply, remaining_supply, price_per_token, category, project_type)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            assetId,
            creator_address,
            name,
            description || '',
            image_url || '',
            metadata_uri || '',
            parseInt(total_supply),
            parseInt(total_supply),
            parseFloat(price_per_token),
            category || 'other',
            project_type || 'both'
        ]);
        
        // Get created asset
        const asset = await db.get(`
            SELECT a.*, u.username as creator_name, u.avatar_url as creator_avatar
            FROM assets a
            LEFT JOIN users u ON a.creator_address = u.wallet_address
            WHERE a.id = ?
        `, [result.id]);
        
        res.status(201).json({
            success: true,
            data: asset,
            message: 'Asset created successfully'
        });
    } catch (error) {
        console.error('Error creating asset:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create asset'
        });
    }
});

// Mint tokens
router.post('/mint', async (req, res) => {
    try {
        const db = req.app.get('db');
        const { asset_id, amount, creator_address } = req.body;
        
        if (!asset_id || !amount || !creator_address) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }
        
        // Check if asset exists and user is creator
        const asset = await db.get(`
            SELECT * FROM assets 
            WHERE asset_id = ? AND creator_address = ? AND status = 'active'
        `, [asset_id, creator_address]);
        
        if (!asset) {
            return res.status(404).json({
                success: false,
                error: 'Asset not found or unauthorized'
            });
        }
        
        const mintAmount = parseInt(amount);
        if (mintAmount <= 0) {
            return res.status(400).json({
                success: false,
                error: 'Invalid amount'
            });
        }
        
        // Update remaining supply
        const newRemainingSupply = asset.remaining_supply + mintAmount;
        
        await db.run(`
            UPDATE assets 
            SET remaining_supply = ?, updated_at = CURRENT_TIMESTAMP
            WHERE asset_id = ?
        `, [newRemainingSupply, asset_id]);
        
        // Create transaction record
        const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        await db.run(`
            INSERT INTO transactions (transaction_id, asset_id, buyer_address, amount, price_per_token, total_amount, transaction_type, status)
            VALUES (?, ?, ?, ?, ?, ?, 'mint', 'completed')
        `, [
            transactionId,
            asset_id,
            creator_address,
            mintAmount,
            asset.price_per_token,
            mintAmount * asset.price_per_token
        ]);
        
        res.json({
            success: true,
            data: {
                transaction_id: transactionId,
                asset_id: asset_id,
                minted_amount: mintAmount,
                new_total_supply: asset.total_supply + mintAmount,
                new_remaining_supply: newRemainingSupply
            },
            message: 'Tokens minted successfully'
        });
    } catch (error) {
        console.error('Error minting tokens:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to mint tokens'
        });
    }
});

// Get user's assets
router.get('/user/:walletAddress', async (req, res) => {
    try {
        const db = req.app.get('db');
        const { walletAddress } = req.params;
        
        const assets = await db.all(`
            SELECT a.*, u.username as creator_name, u.avatar_url as creator_avatar
            FROM assets a
            LEFT JOIN users u ON a.creator_address = u.wallet_address
            WHERE a.creator_address = ? AND a.status = 'active'
            ORDER BY a.created_at DESC
        `, [walletAddress]);
        
        res.json({
            success: true,
            data: assets
        });
    } catch (error) {
        console.error('Error fetching user assets:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch user assets'
        });
    }
});

// Update asset
router.put('/:assetId', async (req, res) => {
    try {
        const db = req.app.get('db');
        const { assetId } = req.params;
        const { name, description, price_per_token, creator_address } = req.body;
        
        // Check if user is creator
        const asset = await db.get(`
            SELECT * FROM assets 
            WHERE asset_id = ? AND creator_address = ? AND status = 'active'
        `, [assetId, creator_address]);
        
        if (!asset) {
            return res.status(404).json({
                success: false,
                error: 'Asset not found or unauthorized'
            });
        }
        
        await db.run(`
            UPDATE assets 
            SET name = ?, description = ?, price_per_token = ?, updated_at = CURRENT_TIMESTAMP
            WHERE asset_id = ?
        `, [name, description, price_per_token, assetId]);
        
        const updatedAsset = await db.get(`
            SELECT a.*, u.username as creator_name, u.avatar_url as creator_avatar
            FROM assets a
            LEFT JOIN users u ON a.creator_address = u.wallet_address
            WHERE a.asset_id = ?
        `, [assetId]);
        
        res.json({
            success: true,
            data: updatedAsset,
            message: 'Asset updated successfully'
        });
    } catch (error) {
        console.error('Error updating asset:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update asset'
        });
    }
});

// Delete asset (soft delete)
router.delete('/:assetId', async (req, res) => {
    try {
        const db = req.app.get('db');
        const { assetId } = req.params;
        const { creator_address } = req.body;
        
        // Check if user is creator
        const asset = await db.get(`
            SELECT * FROM assets 
            WHERE asset_id = ? AND creator_address = ? AND status = 'active'
        `, [assetId, creator_address]);
        
        if (!asset) {
            return res.status(404).json({
                success: false,
                error: 'Asset not found or unauthorized'
            });
        }
        
        await db.run(`
            UPDATE assets 
            SET status = 'deleted', updated_at = CURRENT_TIMESTAMP
            WHERE asset_id = ?
        `, [assetId]);
        
        res.json({
            success: true,
            message: 'Asset deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting asset:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete asset'
        });
    }
});

module.exports = router;