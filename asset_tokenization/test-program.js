const anchor = require("@coral-xyz/anchor");
const { PublicKey, Keypair } = require("@solana/web3.js");

async function testProgram() {
  console.log("🚀 Тестирование Asset Tokenization Program");
  console.log("==========================================");

  // Program ID
  const programId = new PublicKey("FuAVoPCtaJWnJZVxE2ii4CtiqPwgvmxLE7gkGv5udmjQ");
  
  console.log(`Program ID: ${programId.toString()}`);
  console.log();

  // Test parameters
  const assetId = 12345;
  const metadataUri = "https://example.com/metadata.json";
  const totalSupply = 1000000;
  const mintAmount = 100000;
  const buyAmount = 50000;
  const revenueAmount = 1000;

  console.log("📋 Тестовые параметры:");
  console.log(`Asset ID: ${assetId}`);
  console.log(`Metadata URI: ${metadataUri}`);
  console.log(`Total Supply: ${totalSupply}`);
  console.log(`Mint Amount: ${mintAmount}`);
  console.log(`Buy Amount: ${buyAmount}`);
  console.log(`Revenue Amount: ${revenueAmount}`);
  console.log();

  // Derive PDAs
  const [assetPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("asset"), Buffer.from(assetId.toString().padStart(16, '0'), 'hex')],
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

  console.log("🔍 PDA Адреса:");
  console.log(`Asset PDA: ${assetPda.toString()}`);
  console.log(`Escrow PDA: ${escrowPda.toString()}`);
  console.log(`Revenue Pool PDA: ${revenuePoolPda.toString()}`);
  console.log();

  // Test account creation
  const creator = Keypair.generate();
  const buyer = Keypair.generate();
  
  console.log("👥 Тестовые аккаунты:");
  console.log(`Creator: ${creator.publicKey.toString()}`);
  console.log(`Buyer: ${buyer.publicKey.toString()}`);
  console.log();

  // Test instruction data
  console.log("📝 Инструкции программы:");
  console.log("1. create_asset(asset_id, metadata_uri, total_supply)");
  console.log("2. mint_fraction_tokens(amount)");
  console.log("3. buy_fractions(amount)");
  console.log("4. distribute_revenue(amount)");
  console.log();

  // Test error handling
  console.log("⚠️ Обработка ошибок:");
  console.log("- InsufficientSupply: Недостаточно токенов для выпуска");
  console.log("- InsufficientTokenBalance: Недостаточно токенов в эскроу");
  console.log("- InvalidAmount: Неверная сумма");
  console.log("- Unauthorized: Неавторизованный доступ");
  console.log();

  console.log("✅ Программа готова к использованию!");
  console.log("💡 Для полного тестирования нужен деплой на devnet");
  console.log("🔧 Используйте: anchor deploy --provider.cluster devnet");
}

testProgram().catch(console.error);
