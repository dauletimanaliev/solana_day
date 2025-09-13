// Простой скрипт деплоя без Anchor
// =================================

const { Connection, PublicKey, Keypair, SystemProgram } = require('@solana/web3.js');
const fs = require('fs');

async function deployProgram() {
  console.log("🚀 Начинаем деплой Asset Tokenization Program");
  console.log("=============================================");

  try {
    // Подключение к devnet
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    console.log("✅ Подключение к devnet установлено");

    // Загружаем кошелек
    const walletPath = process.env.HOME + '/.config/solana/id.json';
    const walletData = JSON.parse(fs.readFileSync(walletPath, 'utf8'));
    const wallet = Keypair.fromSecretKey(new Uint8Array(walletData));
    console.log("✅ Кошелек загружен:", wallet.publicKey.toString());

    // Проверяем баланс
    const balance = await connection.getBalance(wallet.publicKey);
    console.log("💰 Баланс кошелька:", balance / 1e9, "SOL");

    if (balance < 0.1e9) {
      console.log("⚠️ Недостаточно SOL для деплоя. Запрашиваем airdrop...");
      const airdropSignature = await connection.requestAirdrop(wallet.publicKey, 2e9);
      await connection.confirmTransaction(airdropSignature);
      console.log("✅ Airdrop получен");
    }

    // Program ID (уже определен в lib.rs)
    const programId = new PublicKey("FuAVoPCtaJWnJZVxE2ii4CtiqPwgvmxLE7gkGv5udmjQ");
    console.log("📋 Program ID:", programId.toString());

    // Проверяем, существует ли программа
    const programInfo = await connection.getAccountInfo(programId);
    
    if (programInfo) {
      console.log("✅ Программа уже существует на блокчейне");
      console.log("   Owner:", programInfo.owner.toString());
      console.log("   Executable:", programInfo.executable);
      console.log("   Data Length:", programInfo.data.length, "bytes");
    } else {
      console.log("❌ Программа не найдена на блокчейне");
      console.log("   Нужно собрать и деплоить программу");
    }

    // Тестируем PDA генерацию
    console.log("\n🔍 Тестируем PDA генерацию:");
    
    const testAssetId = 12345;
    const [assetPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("asset"), 
        Buffer.from(testAssetId.toString().padStart(16, '0'), 'hex')
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

    console.log("✅ Asset PDA:", assetPda.toString());
    console.log("✅ Escrow PDA:", escrowPda.toString());
    console.log("✅ Revenue Pool PDA:", revenuePoolPda.toString());

    // Создаем IDL файл для интеграции
    const idl = {
      "version": "0.1.0",
      "name": "asset_tokenization",
      "instructions": [
        {
          "name": "createAsset",
          "accounts": [
            { "name": "asset", "isMut": true, "isSigner": false },
            { "name": "creator", "isMut": true, "isSigner": true },
            { "name": "systemProgram", "isMut": false, "isSigner": false }
          ],
          "args": [
            { "name": "assetId", "type": "u64" },
            { "name": "metadataUri", "type": "string" },
            { "name": "totalSupply", "type": "u64" }
          ]
        },
        {
          "name": "mintFractionTokens",
          "accounts": [
            { "name": "asset", "isMut": true, "isSigner": false },
            { "name": "escrow", "isMut": true, "isSigner": false },
            { "name": "creator", "isMut": true, "isSigner": true },
            { "name": "systemProgram", "isMut": false, "isSigner": false }
          ],
          "args": [
            { "name": "amount", "type": "u64" }
          ]
        },
        {
          "name": "buyFractions",
          "accounts": [
            { "name": "asset", "isMut": true, "isSigner": false },
            { "name": "escrow", "isMut": true, "isSigner": false },
            { "name": "buyer", "isMut": true, "isSigner": true },
            { "name": "systemProgram", "isMut": false, "isSigner": false }
          ],
          "args": [
            { "name": "amount", "type": "u64" }
          ]
        },
        {
          "name": "distributeRevenue",
          "accounts": [
            { "name": "asset", "isMut": true, "isSigner": false },
            { "name": "revenuePool", "isMut": true, "isSigner": false },
            { "name": "creator", "isMut": true, "isSigner": true },
            { "name": "systemProgram", "isMut": false, "isSigner": false }
          ],
          "args": [
            { "name": "amount", "type": "u64" }
          ]
        }
      ],
      "accounts": [
        {
          "name": "Asset",
          "type": {
            "kind": "struct",
            "fields": [
              { "name": "id", "type": "u64" },
              { "name": "creator", "type": "publicKey" },
              { "name": "metadataUri", "type": "string" },
              { "name": "totalSupply", "type": "u64" },
              { "name": "remainingSupply", "type": "u64" },
              { "name": "bump", "type": "u8" }
            ]
          }
        },
        {
          "name": "Escrow",
          "type": {
            "kind": "struct",
            "fields": [
              { "name": "assetId", "type": "u64" },
              { "name": "totalAmount", "type": "u64" },
              { "name": "availableAmount", "type": "u64" }
            ]
          }
        },
        {
          "name": "RevenuePool",
          "type": {
            "kind": "struct",
            "fields": [
              { "name": "assetId", "type": "u64" },
              { "name": "totalRevenue", "type": "u64" },
              { "name": "distributedRevenue", "type": "u64" }
            ]
          }
        }
      ],
      "errors": [
        { "code": 6000, "name": "InsufficientSupply", "msg": "Insufficient supply for minting" },
        { "code": 6001, "name": "InsufficientTokenBalance", "msg": "Insufficient token balance in escrow" },
        { "code": 6002, "name": "InvalidAmount", "msg": "Invalid amount" },
        { "code": 6003, "name": "Unauthorized", "msg": "Unauthorized access" }
      ]
    };

    // Сохраняем IDL
    fs.writeFileSync('./target/idl/asset_tokenization.json', JSON.stringify(idl, null, 2));
    console.log("✅ IDL файл создан: ./target/idl/asset_tokenization.json");

    // Создаем конфигурацию для интеграции
    const config = {
      programId: programId.toString(),
      network: "devnet",
      rpcUrl: "https://api.devnet.solana.com",
      wallet: wallet.publicKey.toString(),
      pdas: {
        asset: assetPda.toString(),
        escrow: escrowPda.toString(),
        revenuePool: revenuePoolPda.toString()
      },
      status: programInfo ? "deployed" : "needs_deployment"
    };

    fs.writeFileSync('./deployment-config.json', JSON.stringify(config, null, 2));
    console.log("✅ Конфигурация деплоя создана: ./deployment-config.json");

    console.log("\n🎯 СТАТУС ДЕПЛОЯ:");
    console.log("==================");
    console.log("✅ Program ID:", programId.toString());
    console.log("✅ Network: devnet");
    console.log("✅ RPC URL: https://api.devnet.solana.com");
    console.log("✅ Wallet:", wallet.publicKey.toString());
    console.log("✅ PDA генерация: работает");
    console.log("✅ IDL файл: создан");
    console.log("✅ Конфигурация: готова");

    if (programInfo) {
      console.log("\n🎉 ПРОГРАММА ГОТОВА К ИСПОЛЬЗОВАНИЮ!");
      console.log("   Frontend/Backend разработчики могут начинать интеграцию");
    } else {
      console.log("\n⚠️ ПРОГРАММА НУЖДАЕТСЯ В ДЕПЛОЕ");
      console.log("   Нужно собрать .so файл и задеплоить через Solana CLI");
    }

  } catch (error) {
    console.error("❌ Ошибка деплоя:", error.message);
  }
}

// Запускаем деплой
deployProgram();
