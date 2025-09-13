// BACKEND: Утилиты для генерации PDA адресов
// ==========================================

const { PublicKey } = require("@solana/web3.js");
const { PROGRAM_ID, SEEDS } = require("./program-config");

/**
 * Генерирует PDA адреса для актива
 * @param {number} assetId - ID актива
 * @param {PublicKey} programId - ID программы (по умолчанию PROGRAM_ID)
 * @returns {Object} Объект с PDA адресами
 */
function generateAssetPDAs(assetId, programId = new PublicKey(PROGRAM_ID)) {
  // Asset PDA
  const [assetPda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from(SEEDS.ASSET), 
      Buffer.from(assetId.toString().padStart(16, '0'), 'hex')
    ],
    programId
  );
  
  // Escrow PDA
  const [escrowPda] = PublicKey.findProgramAddressSync(
    [Buffer.from(SEEDS.ESCROW), assetPda.toBytes()],
    programId
  );
  
  // Revenue Pool PDA
  const [revenuePoolPda] = PublicKey.findProgramAddressSync(
    [Buffer.from(SEEDS.REVENUE_POOL), assetPda.toBytes()],
    programId
  );
  
  return {
    assetPda,
    escrowPda,
    revenuePoolPda
  };
}

/**
 * Генерирует PDA для конкретного актива
 * @param {number} assetId - ID актива
 * @returns {string} PDA адрес актива
 */
function getAssetPDA(assetId) {
  const { assetPda } = generateAssetPDAs(assetId);
  return assetPda.toString();
}

/**
 * Генерирует все PDA для актива
 * @param {number} assetId - ID актива
 * @returns {Object} Все PDA адреса
 */
function getAllPDAs(assetId) {
  const pdas = generateAssetPDAs(assetId);
  return {
    assetPda: pdas.assetPda.toString(),
    escrowPda: pdas.escrowPda.toString(),
    revenuePoolPda: pdas.revenuePoolPda.toString()
  };
}

module.exports = {
  generateAssetPDAs,
  getAssetPDA,
  getAllPDAs
};
