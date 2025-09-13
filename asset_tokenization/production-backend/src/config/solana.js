// ПРОДАКШЕН BACKEND: Solana конфигурация с реальными данными
// =========================================================

const { Connection, PublicKey, Keypair, SystemProgram } = require('@solana/web3.js');
const { Program, AnchorProvider } = require('@coral-xyz/anchor');
const fs = require('fs');
const path = require('path');

// Загружаем конфигурацию из переменных окружения
const SOLANA_CONFIG = {
  rpcUrl: process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com',
  network: process.env.SOLANA_NETWORK || 'devnet',
  programId: new PublicKey(process.env.ANCHOR_PROGRAM_ID || '11111111111111111111111111111111'),
  wallet: null, // Будет загружен из файла
  commitment: 'confirmed'
};

// Создаем подключение
const connection = new Connection(SOLANA_CONFIG.rpcUrl, SOLANA_CONFIG.commitment);

// Загружаем кошелек
let wallet;
try {
  const walletPath = process.env.SOLANA_WALLET_PATH || path.join(process.env.HOME, '.config/solana/id.json');
  const walletData = JSON.parse(fs.readFileSync(walletPath, 'utf8'));
  wallet = Keypair.fromSecretKey(new Uint8Array(walletData));
  SOLANA_CONFIG.wallet = wallet.publicKey;
  console.log('✅ Кошелек загружен:', wallet.publicKey.toString());
} catch (error) {
  console.error('❌ Ошибка загрузки кошелька:', error.message);
  process.exit(1);
}

// Создаем провайдер
const provider = new AnchorProvider(connection, wallet, {
  commitment: SOLANA_CONFIG.commitment,
  preflightCommitment: SOLANA_CONFIG.commitment
});

// Загружаем IDL
let idl;
try {
  const idlPath = path.join(__dirname, '../../../target/idl/asset_tokenization.json');
  idl = JSON.parse(fs.readFileSync(idlPath, 'utf8'));
  console.log('✅ IDL загружен');
} catch (error) {
  console.error('❌ Ошибка загрузки IDL:', error.message);
  process.exit(1);
}

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
  // Проверка подключения
  async checkConnection() {
    try {
      const version = await connection.getVersion();
      const balance = await connection.getBalance(wallet.publicKey);
      return {
        success: true,
        version: version,
        balance: balance / 1e9,
        wallet: wallet.publicKey.toString()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Создание актива
  async createAsset(assetId, metadataUri, totalSupply, creator) {
    try {
      console.log(`📝 Создание актива ${assetId}...`);
      
      const pdas = generatePDAs(assetId);
      const creatorPubkey = new PublicKey(creator);
      
      // Проверяем, что актива еще нет
      try {
        await program.account.asset.fetch(pdas.asset);
        return {
          success: false,
          error: 'Asset already exists'
        };
      } catch (error) {
        // Актив не существует, продолжаем
      }
      
      const tx = await program.methods
        .createAsset(assetId, metadataUri, totalSupply)
        .accounts({
          asset: pdas.asset,
          creator: creatorPubkey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
        
      console.log(`✅ Актив ${assetId} создан, транзакция: ${tx}`);
      
      return {
        success: true,
        transaction: tx,
        assetPda: pdas.asset.toString(),
        escrowPda: pdas.escrow.toString(),
        revenuePoolPda: pdas.revenuePool.toString()
      };
    } catch (error) {
      console.error('❌ Ошибка создания актива:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Минтинг фракционных токенов
  async mintFractionTokens(assetId, amount, creator) {
    try {
      console.log(`🪙 Минтинг ${amount} токенов для актива ${assetId}...`);
      
      const pdas = generatePDAs(assetId);
      const creatorPubkey = new PublicKey(creator);
      
      const tx = await program.methods
        .mintFractionTokens(amount)
        .accounts({
          asset: pdas.asset,
          escrow: pdas.escrow,
          creator: creatorPubkey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
        
      console.log(`✅ Токены заминчены, транзакция: ${tx}`);
      
      return {
        success: true,
        transaction: tx
      };
    } catch (error) {
      console.error('❌ Ошибка минтинга токенов:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Покупка фракций
  async buyFractions(assetId, amount, buyer) {
    try {
      console.log(`💰 Покупка ${amount} фракций актива ${assetId}...`);
      
      const pdas = generatePDAs(assetId);
      const buyerPubkey = new PublicKey(buyer);
      
      const tx = await program.methods
        .buyFractions(amount)
        .accounts({
          asset: pdas.asset,
          escrow: pdas.escrow,
          buyer: buyerPubkey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
        
      console.log(`✅ Фракции куплены, транзакция: ${tx}`);
      
      return {
        success: true,
        transaction: tx
      };
    } catch (error) {
      console.error('❌ Ошибка покупки фракций:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Распределение дохода
  async distributeRevenue(assetId, amount, creator) {
    try {
      console.log(`💸 Распределение ${amount} дохода для актива ${assetId}...`);
      
      const pdas = generatePDAs(assetId);
      const creatorPubkey = new PublicKey(creator);
      
      const tx = await program.methods
        .distributeRevenue(amount)
        .accounts({
          asset: pdas.asset,
          revenuePool: pdas.revenuePool,
          creator: creatorPubkey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
        
      console.log(`✅ Доход распределен, транзакция: ${tx}`);
      
      return {
        success: true,
        transaction: tx
      };
    } catch (error) {
      console.error('❌ Ошибка распределения дохода:', error);
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
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Получение всех активов (из базы данных)
  async getAllAssets() {
    try {
      // В реальном приложении здесь будет запрос к базе данных
      // Пока возвращаем пустой массив
      return {
        success: true,
        assets: []
      };
    } catch (error) {
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
