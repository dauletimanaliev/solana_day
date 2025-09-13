// Transactions API Routes
// =======================

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// Donate to asset
router.post('/donate', async (req, res) => {
    try {
        const db = req.app.get('db');
        const { asset_id, donor_address, amount } = req.body;
        
        if (!asset_id || !donor_address || !amount) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }
        
        const donateAmount = parseFloat(amount);
        if (donateAmount <= 0) {
            return res.status(400).json({
                success: false,
                error: 'Invalid amount'
            });
        }
        
        // Get asset details
        const asset = await db.get(`
            SELECT * FROM assets WHERE asset_id = ?
        `, [asset_id]);
        
        if (!asset) {
            return res.status(404).json({
                success: false,
                error: 'Asset not found'
            });
        }
        
        // Create donation transaction
        const transactionId = uuidv4();
        const timestamp = new Date().toISOString();
        
        await db.run(`
            INSERT INTO transactions (
                transaction_id, asset_id, buyer_address, amount, 
                price_per_token, total_amount, transaction_type, status, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [transactionId, asset_id, donor_address, donateAmount, 0, donateAmount, 'donation', 'completed', timestamp]);
        
        // Update token holders for dividend tracking
        await updateTokenHolders(db, asset_id, donor_address, 0, 'donation');
        
        // Note: total_raised field not available in current schema
        
        res.json({
            success: true,
            transaction_id: transactionId,
            message: 'Donation successful',
            amount: donateAmount,
            asset_name: asset.name
        });
        
    } catch (error) {
        console.error('Donation error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// Buy asset tokens
router.post('/buy', async (req, res) => {
    try {
        const db = req.app.get('db');
        const { asset_id, buyer_address, amount } = req.body;
        
        if (!asset_id || !buyer_address || !amount) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }
        
        const buyAmount = parseInt(amount);
        if (buyAmount <= 0) {
            return res.status(400).json({
                success: false,
                error: 'Invalid amount'
            });
        }
        
        // Get asset details
        const asset = await db.get(`
            SELECT * FROM assets 
            WHERE asset_id = ? AND status = 'active'
        `, [asset_id]);
        
        if (!asset) {
            return res.status(404).json({
                success: false,
                error: 'Asset not found'
            });
        }
        
        if (asset.remaining_supply < buyAmount) {
            return res.status(400).json({
                success: false,
                error: 'Insufficient supply'
            });
        }
        
        const totalCost = buyAmount * asset.price_per_token;
        
        // Update asset remaining supply
        const newRemainingSupply = asset.remaining_supply - buyAmount;
        await db.run(`
            UPDATE assets 
            SET remaining_supply = ?, updated_at = CURRENT_TIMESTAMP
            WHERE asset_id = ?
        `, [newRemainingSupply, asset_id]);
        
        // Create transaction record
        const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        await db.run(`
            INSERT INTO transactions (transaction_id, asset_id, buyer_address, seller_address, amount, price_per_token, total_amount, transaction_type, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'buy', 'completed')
        `, [
            transactionId,
            asset_id,
            buyer_address,
            asset.creator_address,
            buyAmount,
            asset.price_per_token,
            totalCost
        ]);
        
        // Update analytics
        await db.run(`
            UPDATE analytics 
            SET total_volume = total_volume + ?, total_transactions = total_transactions + 1
            WHERE date = date('now')
        `, [totalCost]);
        
        res.json({
            success: true,
            data: {
                transaction_id: transactionId,
                asset_id: asset_id,
                amount: buyAmount,
                price_per_token: asset.price_per_token,
                total_cost: totalCost,
                remaining_supply: newRemainingSupply
            },
            message: 'Purchase completed successfully'
        });
    } catch (error) {
        console.error('Error buying tokens:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to complete purchase'
        });
    }
});

// Sell asset tokens
router.post('/sell', async (req, res) => {
    try {
        const db = req.app.get('db');
        const { asset_id, seller_address, amount, price_per_token } = req.body;
        
        if (!asset_id || !seller_address || !amount || !price_per_token) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }
        
        const sellAmount = parseInt(amount);
        const sellPrice = parseFloat(price_per_token);
        
        if (sellAmount <= 0 || sellPrice <= 0) {
            return res.status(400).json({
                success: false,
                error: 'Invalid amount or price'
            });
        }
        
        // Create market offer
        const offerId = `OFFER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        await db.run(`
            INSERT INTO market_offers (offer_id, asset_id, seller_address, amount, price_per_token, status)
            VALUES (?, ?, ?, ?, ?, 'active')
        `, [offerId, asset_id, seller_address, sellAmount, sellPrice]);
        
        res.json({
            success: true,
            data: {
                offer_id: offerId,
                asset_id: asset_id,
                amount: sellAmount,
                price_per_token: sellPrice,
                total_value: sellAmount * sellPrice
            },
            message: 'Sell offer created successfully'
        });
    } catch (error) {
        console.error('Error creating sell offer:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create sell offer'
        });
    }
});

// Get transaction history
router.get('/history/:walletAddress', async (req, res) => {
    try {
        const db = req.app.get('db');
        const { walletAddress } = req.params;
        const { limit = 50, offset = 0 } = req.query;
        
        const transactions = await db.all(`
            SELECT t.*, a.name as asset_name, a.image_url as asset_image
            FROM transactions t
            LEFT JOIN assets a ON t.asset_id = a.asset_id
            WHERE t.buyer_address = ? OR t.seller_address = ?
            ORDER BY t.created_at DESC
            LIMIT ? OFFSET ?
        `, [walletAddress, walletAddress, parseInt(limit), parseInt(offset)]);
        
        res.json({
            success: true,
            data: transactions,
            pagination: {
                limit: parseInt(limit),
                offset: parseInt(offset),
                total: transactions.length
            }
        });
    } catch (error) {
        console.error('Error fetching transaction history:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch transaction history'
        });
    }
});

// Get single transaction
router.get('/:transactionId', async (req, res) => {
    try {
        const db = req.app.get('db');
        const { transactionId } = req.params;
        
        const transaction = await db.get(`
            SELECT t.*, a.name as asset_name, a.image_url as asset_image
            FROM transactions t
            LEFT JOIN assets a ON t.asset_id = a.asset_id
            WHERE t.transaction_id = ?
        `, [transactionId]);
        
        if (!transaction) {
            return res.status(404).json({
                success: false,
                error: 'Transaction not found'
            });
        }
        
        res.json({
            success: true,
            data: transaction
        });
    } catch (error) {
        console.error('Error fetching transaction:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch transaction'
        });
    }
});

// Get market offers
router.get('/offers/:assetId', async (req, res) => {
    try {
        const db = req.app.get('db');
        const { assetId } = req.params;
        
        const offers = await db.all(`
            SELECT mo.*, u.username as seller_name, u.avatar_url as seller_avatar
            FROM market_offers mo
            LEFT JOIN users u ON mo.seller_address = u.wallet_address
            WHERE mo.asset_id = ? AND mo.status = 'active'
            ORDER BY mo.price_per_token ASC
        `, [assetId]);
        
        res.json({
            success: true,
            data: offers
        });
    } catch (error) {
        console.error('Error fetching market offers:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch market offers'
        });
    }
});

// Accept market offer
router.post('/accept-offer', async (req, res) => {
    try {
        const db = req.app.get('db');
        const { offer_id, buyer_address } = req.body;
        
        if (!offer_id || !buyer_address) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }
        
        // Get offer details
        const offer = await db.get(`
            SELECT * FROM market_offers 
            WHERE offer_id = ? AND status = 'active'
        `, [offer_id]);
        
        if (!offer) {
            return res.status(404).json({
                success: false,
                error: 'Offer not found or expired'
            });
        }
        
        const totalCost = offer.amount * offer.price_per_token;
        
        // Create transaction record
        const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        await db.run(`
            INSERT INTO transactions (transaction_id, asset_id, buyer_address, seller_address, amount, price_per_token, total_amount, transaction_type, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'buy', 'completed')
        `, [
            transactionId,
            offer.asset_id,
            buyer_address,
            offer.seller_address,
            offer.amount,
            offer.price_per_token,
            totalCost
        ]);
        
        // Mark offer as completed
        await db.run(`
            UPDATE market_offers 
            SET status = 'completed'
            WHERE offer_id = ?
        `, [offer_id]);
        
        res.json({
            success: true,
            data: {
                transaction_id: transactionId,
                offer_id: offer_id,
                amount: offer.amount,
                price_per_token: offer.price_per_token,
                total_cost: totalCost
            },
            message: 'Offer accepted successfully'
        });
    } catch (error) {
        console.error('Error accepting offer:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to accept offer'
        });
    }
});

// Distribute revenue
router.post('/distribute-revenue', async (req, res) => {
    try {
        const db = req.app.get('db');
        const { asset_id, creator_address, total_revenue } = req.body;
        
        if (!asset_id || !creator_address || !total_revenue) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }
        
        // Get asset details
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
        
        const revenue = parseFloat(total_revenue);
        const distributionPerToken = revenue / asset.total_supply;
        
        // Create revenue distribution record
        const distributionId = `REV_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        await db.run(`
            INSERT INTO revenue_distributions (distribution_id, asset_id, creator_address, total_revenue, distribution_per_token, status)
            VALUES (?, ?, ?, ?, ?, 'completed')
        `, [distributionId, asset_id, creator_address, revenue, distributionPerToken]);
        
        res.json({
            success: true,
            data: {
                distribution_id: distributionId,
                asset_id: asset_id,
                total_revenue: revenue,
                distribution_per_token: distributionPerToken,
                total_tokens: asset.total_supply
            },
            message: 'Revenue distribution completed successfully'
        });
    } catch (error) {
        console.error('Error distributing revenue:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to distribute revenue'
        });
    }
});

// Sell tokens
router.post('/sell', async (req, res) => {
    try {
        const db = req.app.get('db');
        const { asset_id, seller_address, amount, price_per_token } = req.body;
        
        if (!asset_id || !seller_address || !amount || !price_per_token) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }
        
        const sellAmount = parseInt(amount);
        const sellPrice = parseFloat(price_per_token);
        
        if (sellAmount <= 0 || sellPrice <= 0) {
            return res.status(400).json({
                success: false,
                error: 'Invalid amount or price'
            });
        }
        
        // Check if seller has enough tokens
        const holder = await db.get(`
            SELECT token_amount FROM token_holders 
            WHERE asset_id = ? AND holder_address = ?
        `, [asset_id, seller_address]);
        
        if (!holder || holder.token_amount < sellAmount) {
            return res.status(400).json({
                success: false,
                error: 'Insufficient token balance'
            });
        }
        
        // Create sell transaction
        const transactionId = uuidv4();
        const timestamp = new Date().toISOString();
        const totalAmount = sellAmount * sellPrice;
        
        await db.run(`
            INSERT INTO transactions (
                transaction_id, asset_id, buyer_address, seller_address, amount, 
                price_per_token, total_amount, transaction_type, status, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [transactionId, asset_id, null, seller_address, sellAmount, sellPrice, totalAmount, 'sell', 'pending', timestamp]);
        
        // Update token holders
        const newTokenAmount = holder.token_amount - sellAmount;
        await updateTokenHolders(db, asset_id, seller_address, newTokenAmount, 'sell');
        
        res.json({
            success: true,
            data: {
                transaction_id: transactionId,
                asset_id: asset_id,
                seller_address: seller_address,
                amount: sellAmount,
                price_per_token: sellPrice,
                total_amount: totalAmount,
                status: 'pending'
            },
            message: 'Sell order created successfully'
        });
        
    } catch (error) {
        console.error('Error creating sell order:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create sell order'
        });
    }
});

// Buy tokens from sell order
router.post('/buy', async (req, res) => {
    try {
        const db = req.app.get('db');
        const { asset_id, buyer_address, amount, max_price_per_token } = req.body;
        
        if (!asset_id || !buyer_address || !amount) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }
        
        const buyAmount = parseInt(amount);
        const maxPrice = parseFloat(max_price_per_token) || 999999;
        
        if (buyAmount <= 0) {
            return res.status(400).json({
                success: false,
                error: 'Invalid amount'
            });
        }
        
        // Find available sell orders
        const sellOrders = await db.all(`
            SELECT * FROM transactions 
            WHERE asset_id = ? AND transaction_type = 'sell' 
            AND status = 'pending' AND price_per_token <= ?
            ORDER BY price_per_token ASC, created_at ASC
        `, [asset_id, maxPrice]);
        
        if (sellOrders.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'No available sell orders at this price'
            });
        }
        
        let remainingAmount = buyAmount;
        const executedOrders = [];
        
        for (const order of sellOrders) {
            if (remainingAmount <= 0) break;
            
            const executeAmount = Math.min(remainingAmount, order.amount);
            const totalCost = executeAmount * order.price_per_token;
            
            // Create buy transaction
            const transactionId = uuidv4();
            const timestamp = new Date().toISOString();
            
            await db.run(`
                INSERT INTO transactions (
                    transaction_id, asset_id, buyer_address, seller_address, amount, 
                    price_per_token, total_amount, transaction_type, status, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [transactionId, asset_id, buyer_address, order.seller_address, executeAmount, order.price_per_token, totalCost, 'buy', 'completed', timestamp]);
            
            // Update token holders
            await updateTokenHolders(db, asset_id, buyer_address, executeAmount, 'buy');
            
            // Update sell order
            const newSellAmount = order.amount - executeAmount;
            if (newSellAmount > 0) {
                await db.run(`
                    UPDATE transactions SET amount = ? WHERE transaction_id = ?
                `, [newSellAmount, order.transaction_id]);
            } else {
                await db.run(`
                    UPDATE transactions SET status = 'completed' WHERE transaction_id = ?
                `, [order.transaction_id]);
            }
            
            executedOrders.push({
                transaction_id: transactionId,
                seller_address: order.seller_address,
                amount: executeAmount,
                price_per_token: order.price_per_token,
                total_cost: totalCost
            });
            
            remainingAmount -= executeAmount;
        }
        
        res.json({
            success: true,
            data: {
                executed_orders: executedOrders,
                total_executed: buyAmount - remainingAmount,
                remaining_amount: remainingAmount
            },
            message: 'Buy orders executed successfully'
        });
        
    } catch (error) {
        console.error('Error executing buy orders:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to execute buy orders'
        });
    }
});

// Helper function to update token holders
async function updateTokenHolders(db, asset_id, holder_address, token_amount, transaction_type) {
    try {
        // Get asset total supply
        const asset = await db.get(`
            SELECT total_supply FROM assets WHERE asset_id = ?
        `, [asset_id]);
        
        if (!asset) return;
        
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
    } catch (error) {
        console.error('Error updating token holders:', error);
    }
}

module.exports = router;