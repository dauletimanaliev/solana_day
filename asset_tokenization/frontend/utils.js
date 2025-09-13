// FRONTEND: Утилиты для Frontend разработчика
// ==========================================

import { PublicKey } from "@solana/web3.js";
import { PROGRAM_CONFIG, ERROR_MESSAGES } from "./config";

/**
 * Генерирует PDA адреса для актива
 * @param {number} assetId - ID актива
 * @returns {Object} PDA адреса
 */
export function generateAssetPDAs(assetId) {
  const programId = new PublicKey(PROGRAM_CONFIG.PROGRAM_ID);
  
  const [assetPda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("asset"), 
      Buffer.from(assetId.toString().padStart(16, '0'), 'hex')
    ],
    programId
  );
  
  const [escrowPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("escrow"), assetPda.toBytes()],
    programId
  );
  
  const [revenuePoolPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("revenue_pool"), assetPda.toBytes()],
    programId
  );
  
  return {
    assetPda: assetPda.toString(),
    escrowPda: escrowPda.toString(),
    revenuePoolPda: revenuePoolPda.toString()
  };
}

/**
 * Форматирует адрес для отображения
 * @param {string} address - Адрес для форматирования
 * @param {number} start - Количество символов в начале
 * @param {number} end - Количество символов в конце
 * @returns {string} Отформатированный адрес
 */
export function formatAddress(address, start = 4, end = 4) {
  if (!address) return "";
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}

/**
 * Форматирует число с разделителями
 * @param {number} amount - Число для форматирования
 * @returns {string} Отформатированное число
 */
export function formatAmount(amount) {
  return new Intl.NumberFormat('ru-RU').format(amount);
}

/**
 * Генерирует случайный Asset ID
 * @returns {number} Случайный Asset ID
 */
export function generateAssetId() {
  return Math.floor(Math.random() * 1000000);
}

/**
 * Валидирует Asset ID
 * @param {string|number} assetId - Asset ID для валидации
 * @returns {boolean} Валидный ли Asset ID
 */
export function validateAssetId(assetId) {
  const id = parseInt(assetId);
  return !isNaN(id) && id > 0 && id <= 999999;
}

/**
 * Валидирует количество токенов
 * @param {string|number} amount - Количество для валидации
 * @returns {boolean} Валидное ли количество
 */
export function validateAmount(amount) {
  const num = parseInt(amount);
  return !isNaN(num) && num > 0;
}

/**
 * Обрабатывает ошибки API
 * @param {Error} error - Ошибка
 * @returns {string} Сообщение об ошибке
 */
export function handleApiError(error) {
  if (error.code && ERROR_MESSAGES[error.code]) {
    return ERROR_MESSAGES[error.code];
  }
  
  if (error.message) {
    return error.message;
  }
  
  return ERROR_MESSAGES.NETWORK_ERROR;
}

/**
 * Проверяет подключение кошелька
 * @param {Object} wallet - Объект кошелька
 * @returns {boolean} Подключен ли кошелек
 */
export function isWalletConnected(wallet) {
  return wallet && wallet.publicKey;
}

/**
 * Получает публичный ключ кошелька
 * @param {Object} wallet - Объект кошелька
 * @returns {string|null} Публичный ключ или null
 */
export function getWalletPublicKey(wallet) {
  return wallet?.publicKey?.toString() || null;
}

/**
 * Форматирует дату для отображения
 * @param {Date|string} date - Дата
 * @returns {string} Отформатированная дата
 */
export function formatDate(date) {
  return new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
}

/**
 * Вычисляет процент владения
 * @param {number} ownedAmount - Количество владения
 * @param {number} totalSupply - Общее количество
 * @returns {number} Процент владения
 */
export function calculateOwnershipPercentage(ownedAmount, totalSupply) {
  if (totalSupply === 0) return 0;
  return ((ownedAmount / totalSupply) * 100).toFixed(2);
}
