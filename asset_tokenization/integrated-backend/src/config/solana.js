// ИНТЕГРИРОВАННЫЙ BACKEND: Solana конфигурация
// ============================================

const { Connection, PublicKey, Keypair } = require('@solana/web3.js');
const { Program, AnchorProvider } = require('@coral-xyz/anchor');
const fs = require('fs');

// Загружаем конфигурацию деплоя
const deploymentConfig = JSON.parse(fs.readFileSync('../config.json', 'utf8'));

// Solana конфигурация
const SOLANA_CONFIG = {
  rpcUrl: deploymentConfig.rpcUrl,
  network: deploymentConfig.network,
  programId: new PublicKey(deploymentConfig.programId),
  wallet: new PublicKey(deploymentConfig.wallet),
  pdas: {
    asset: new PublicKey(deploymentConfig.pdas.asset),
    escrow: new PublicKey(deploymentConfig.pdas.escrow),
    revenuePool: new PublicKey(deploymentConfig.pdas.revenuePool)
  }
};

// Создаем подключение
const connection = new Connection(SOLANA_CONFIG.rpcUrl, 'confirmed');

// Загружаем кошелек
const walletPath = process.env.HOME + '/.config/solana/id.json';
const walletData = JSON.parse(fs.readFileSync(walletPath, 'utf8'));
const wallet = Keypair.fromSecretKey(new Uint8Array(walletData));

// Создаем провайдер
const provider = new AnchorProvider(connection, wallet, {
  commitment: 'confirmed',
  preflightCommitment: 'confirmed'
});

// Загружаем IDL
const idl = JSON.parse(fs.readFileSync('../../target/idl/asset_tokenization.json', 'utf8'));

// Создаем программу
const program = new Program(idl, SOLANA_CONFIG.programId, provider);

// Функции для работы с PDA
const generatePDAs = (assetId) => {
  const [assetPda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("asset"), 
      Buffer.from(assetId.toString().padStart(16, '0'), 'hex')
    ],
    SOLANA_CONFIG.programId
  );
  
  const [escrowPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("escrow"), assetPda.toBytes()],
    SOLANA_CONFIG.programId
  );
  
  const [revenuePoolPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("revenue_pool"), assetPda.toBytes()],
    SOLANA_CONFIG.programId
  );

  return {
    asset: assetPda,
    escrow: escrowPda,
    revenuePool: revenuePoolPda
  };
};

// Реальные функции для работы с программой
const solanaService = {
  // Создание актива
  async createAsset(assetId, metadataUri, totalSupply, creator) {
    try {
      const pdas = generatePDAs(assetId);
      
      const tx = await program.methods
        .createAsset(assetId, metadataUri, totalSupply)
        .accounts({
          asset: pdas.asset,
          creator: new PublicKey(creator),
          systemProgram: SystemProgram.programId,
        })
        .rpc();
        
      return {
        success: true,
        transaction: tx,
        assetPda: pdas.asset.toString(),
        escrowPda: pdas.escrow.toString(),
        revenuePoolPda: pdas.revenuePool.toString()
      };
    } catch (error) {
      console.error('Error creating asset:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Минтинг фракционных токенов
  async mintFractionTokens(assetId, amount, creator) {
    try {
      const pdas = generatePDAs(assetId);
      
      const tx = await program.methods
        .mintFractionTokens(amount)
        .accounts({
          asset: pdas.asset,
          escrow: pdas.escrow,
          creator: new PublicKey(creator),
          systemProgram: SystemProgram.programId,
        })
        .rpc();
        
      return {
        success: true,
        transaction: tx
      };
    } catch (error) {
      console.error('Error minting tokens:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Покупка фракций
  async buyFractions(assetId, amount, buyer) {
    try {
      const pdas = generatePDAs(assetId);
      
      const tx = await program.methods
        .buyFractions(amount)
        .accounts({
          asset: pdas.asset,
          escrow: pdas.escrow,
          buyer: new PublicKey(buyer),
          systemProgram: SystemProgram.programId,
        })
        .rpc();
        
      return {
        success: true,
        transaction: tx
      };
    } catch (error) {
      console.error('Error buying fractions:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Распределение дохода
  async distributeRevenue(assetId, amount, creator) {
    try {
      const pdas = generatePDAs(assetId);
      
      const tx = await program.methods
        .distributeRevenue(amount)
        .accounts({
          asset: pdas.asset,
          revenuePool: pdas.revenuePool,
          creator: new PublicKey(creator),
          systemProgram: SystemProgram.programId,
        })
        .rpc();
        
      return {
        success: true,
        transaction: tx
      };
    } catch (error) {
      console.error('Error distributing revenue:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Получение информации об активе
  async getAssetInfo(assetId) {
    try {
      const pdas = generatePDAs(assetId);
      const assetAccount = await program.account.asset.fetch(pdas.asset);
      
      return {
        success: true,
        asset: {
          id: assetAccount.id.toString(),
          creator: assetAccount.creator.toString(),
          metadataUri: assetAccount.metadataUri,
          totalSupply: assetAccount.totalSupply.toString(),
          remainingSupply: assetAccount.remainingSupply.toString(),
          bump: assetAccount.bump
        }
      };
    } catch (error) {
      console.error('Error fetching asset info:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Получение информации об эскроу
  async getEscrowInfo(assetId) {
    try {
      const pdas = generatePDAs(assetId);
      const escrowAccount = await program.account.escrow.fetch(pdas.escrow);
      
      return {
        success: true,
        escrow: {
          assetId: escrowAccount.assetId.toString(),
          totalAmount: escrowAccount.totalAmount.toString(),
          availableAmount: escrowAccount.availableAmount.toString()
        }
      };
    } catch (error) {
      console.error('Error fetching escrow info:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Получение информации о пуле дохода
  async getRevenuePoolInfo(assetId) {
    try {
      const pdas = generatePDAs(assetId);
      const revenuePoolAccount = await program.account.revenuePool.fetch(pdas.revenuePool);
      
      return {
        success: true,
        revenuePool: {
          assetId: revenuePoolAccount.assetId.toString(),
          totalRevenue: revenuePoolAccount.totalRevenue.toString(),
          distributedRevenue: revenuePoolAccount.distributedRevenue.toString()
        }
      };
    } catch (error) {
      console.error('Error fetching revenue pool info:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
};

module.exports = {
  SOLANA_CONFIG,
  connection,
  program,
  provider,
  wallet,
  generatePDAs,
  solanaService
};
