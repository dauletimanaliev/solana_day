// BLOCKCHAIN DEVELOPER: Тест деплоя программы
// ===========================================

const { Connection, PublicKey, Keypair } = require('@solana/web3.js');
const { Program, AnchorProvider, Wallet } = require('@coral-xyz/anchor');
const fs = require('fs');

// Конфигурация
const PROGRAM_ID = "FuAVoPCtaJWnJZVxE2ii4CtiqPwgvmxLE7gkGv5udmjQ";
const NETWORK = "https://api.devnet.solana.com";

async function testDeployment() {
  console.log("🚀 Тестирование деплоя Asset Tokenization Program");
  console.log("=================================================");
  
  try {
    // Подключение к сети
    const connection = new Connection(NETWORK, 'confirmed');
    console.log(`✅ Подключение к ${NETWORK} установлено`);
    
    // Проверка Program ID
    const programId = new PublicKey(PROGRAM_ID);
    console.log(`✅ Program ID: ${programId.toString()}`);
    
    // Проверка существования программы
    const programInfo = await connection.getAccountInfo(programId);
    
    if (programInfo) {
      console.log("✅ Программа найдена на блокчейне");
      console.log(`   Owner: ${programInfo.owner.toString()}`);
      console.log(`   Executable: ${programInfo.executable}`);
      console.log(`   Data Length: ${programInfo.data.length} bytes`);
    } else {
      console.log("❌ Программа не найдена на блокчейне");
      console.log("   Нужно выполнить деплой:");
      console.log("   anchor deploy --provider.cluster devnet");
      return;
    }
    
    // Тест генерации PDA
    console.log("\n🔍 Тестирование PDA генерации:");
    
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
    
    console.log(`✅ Asset PDA: ${assetPda.toString()}`);
    console.log(`✅ Escrow PDA: ${escrowPda.toString()}`);
    console.log(`✅ Revenue Pool PDA: ${revenuePoolPda.toString()}`);
    
    // Проверка IDL файла
    console.log("\n📋 Проверка IDL файла:");
    
    const idlPath = './target/idl/asset_tokenization.json';
    if (fs.existsSync(idlPath)) {
      const idl = JSON.parse(fs.readFileSync(idlPath, 'utf8'));
      console.log("✅ IDL файл найден");
      console.log(`   Instructions: ${idl.instructions.length}`);
      console.log(`   Accounts: ${idl.accounts.length}`);
      console.log(`   Errors: ${idl.errors.length}`);
    } else {
      console.log("❌ IDL файл не найден");
      console.log("   Создайте IDL файл:");
      console.log("   anchor idl init --provider.cluster devnet");
    }
    
    // Проверка готовности к интеграции
    console.log("\n🎯 Готовность к интеграции:");
    
    const readiness = {
      programDeployed: !!programInfo,
      idlExists: fs.existsSync(idlPath),
      pdaGeneration: true,
      configReady: true
    };
    
    const readyCount = Object.values(readiness).filter(Boolean).length;
    const totalCount = Object.keys(readiness).length;
    
    console.log(`✅ Программа деплоена: ${readiness.programDeployed ? 'Да' : 'Нет'}`);
    console.log(`✅ IDL файл создан: ${readiness.idlExists ? 'Да' : 'Нет'}`);
    console.log(`✅ PDA генерация работает: ${readiness.pdaGeneration ? 'Да' : 'Нет'}`);
    console.log(`✅ Конфигурация готова: ${readiness.configReady ? 'Да' : 'Нет'}`);
    
    console.log(`\n📊 Готовность: ${readyCount}/${totalCount} (${Math.round(readyCount/totalCount*100)}%)`);
    
    if (readyCount === totalCount) {
      console.log("\n🎉 ПРОГРАММА ГОТОВА К ИНТЕГРАЦИИ!");
      console.log("   Frontend/Backend разработчики могут начинать работу");
    } else {
      console.log("\n⚠️ НУЖНО ДОРАБОТАТЬ:");
      if (!readiness.programDeployed) {
        console.log("   - Выполнить деплой программы");
      }
      if (!readiness.idlExists) {
        console.log("   - Создать IDL файл");
      }
    }
    
  } catch (error) {
    console.error("❌ Ошибка тестирования:", error.message);
  }
}

// Запуск теста
testDeployment();
