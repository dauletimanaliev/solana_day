// BACKEND: API маршруты для работы с программой
// =============================================

const express = require('express');
const { PublicKey, SystemProgram } = require('@solana/web3.js');
const { Connection, clusterApiUrl } = require('@solana/web3.js');
const { Program, AnchorProvider, Wallet } = require('@coral-xyz/anchor');
const { generateAssetPDAs } = require('./pda-utils');
const { PROGRAM_ID, NETWORK, ERROR_CODES } = require('./program-config');

const router = express.Router();

// Подключение к Solana
const connection = new Connection(clusterApiUrl(NETWORK));
const program = new Program(idl, new PublicKey(PROGRAM_ID), provider);

/**
 * POST /api/assets - Создание нового актива
 */
router.post('/assets', async (req, res) => {
  try {
    const { assetId, metadataUri, totalSupply, creator } = req.body;
    
    // Валидация
    if (!assetId || !metadataUri || !totalSupply || !creator) {
      return res.status(400).json({ 
        error: 'Missing required fields: assetId, metadataUri, totalSupply, creator' 
      });
    }
    
    // Генерация PDA
    const { assetPda } = generateAssetPDAs(assetId);
    
    // Создание транзакции
    const tx = await program.methods
      .createAsset(assetId, metadataUri, totalSupply)
      .accounts({
        asset: assetPda,
        creator: new PublicKey(creator),
        systemProgram: SystemProgram.programId,
      })
      .rpc();
    
    res.json({
      success: true,
      transaction: tx,
      assetPda: assetPda.toString(),
      assetId: assetId
    });
    
  } catch (error) {
    console.error('Error creating asset:', error);
    res.status(400).json({ 
      error: handleProgramError(error).message 
    });
  }
});

/**
 * POST /api/assets/:id/mint - Выпуск фракционных токенов
 */
router.post('/assets/:id/mint', async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, creator } = req.body;
    
    const { assetPda, escrowPda } = generateAssetPDAs(parseInt(id));
    
    const tx = await program.methods
      .mintFractionTokens(amount)
      .accounts({
        asset: assetPda,
        escrow: escrowPda,
        creator: new PublicKey(creator),
        // ... другие аккаунты
      })
      .rpc();
    
    res.json({
      success: true,
      transaction: tx,
      amount: amount
    });
    
  } catch (error) {
    console.error('Error minting tokens:', error);
    res.status(400).json({ 
      error: handleProgramError(error).message 
    });
  }
});

/**
 * POST /api/assets/:id/buy - Покупка фракций
 */
router.post('/assets/:id/buy', async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, buyer } = req.body;
    
    const { assetPda, escrowPda } = generateAssetPDAs(parseInt(id));
    
    const tx = await program.methods
      .buyFractions(amount)
      .accounts({
        asset: assetPda,
        escrow: escrowPda,
        buyer: new PublicKey(buyer),
        // ... другие аккаунты
      })
      .rpc();
    
    res.json({
      success: true,
      transaction: tx,
      amount: amount
    });
    
  } catch (error) {
    console.error('Error buying fractions:', error);
    res.status(400).json({ 
      error: handleProgramError(error).message 
    });
  }
});

/**
 * POST /api/assets/:id/distribute - Распределение дохода
 */
router.post('/assets/:id/distribute', async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, creator } = req.body;
    
    const { assetPda, revenuePoolPda } = generateAssetPDAs(parseInt(id));
    
    const tx = await program.methods
      .distributeRevenue(amount)
      .accounts({
        asset: assetPda,
        revenuePool: revenuePoolPda,
        creator: new PublicKey(creator),
        // ... другие аккаунты
      })
      .rpc();
    
    res.json({
      success: true,
      transaction: tx,
      amount: amount
    });
    
  } catch (error) {
    console.error('Error distributing revenue:', error);
    res.status(400).json({ 
      error: handleProgramError(error).message 
    });
  }
});

/**
 * GET /api/assets/:id - Получение информации об активе
 */
router.get('/assets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { assetPda } = generateAssetPDAs(parseInt(id));
    
    // Получение данных актива из программы
    const assetData = await program.account.asset.fetch(assetPda);
    
    res.json({
      success: true,
      asset: {
        id: assetData.id,
        creator: assetData.creator.toString(),
        metadataUri: assetData.metadataUri,
        totalSupply: assetData.totalSupply.toString(),
        pdaAddress: assetPda.toString()
      }
    });
    
  } catch (error) {
    console.error('Error fetching asset:', error);
    res.status(404).json({ 
      error: 'Asset not found' 
    });
  }
});

/**
 * Обработка ошибок программы
 */
function handleProgramError(error) {
  const errorCode = error.code;
  const errorName = ERROR_CODES[errorCode] || "UnknownError";
  
  return {
    code: errorCode,
    name: errorName,
    message: error.message
  };
}

module.exports = router;
