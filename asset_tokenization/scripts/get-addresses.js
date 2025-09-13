const anchor = require("@coral-xyz/anchor");
const { PublicKey } = require("@solana/web3.js");

async function getAddresses() {
  // Program ID from lib.rs
  const programId = new PublicKey("FuAVoPCtaJWnJZVxE2ii4CtiqPwgvmxLE7gkGv5udmjQ");

  console.log("🚀 Asset Tokenization Program Addresses");
  console.log("=====================================");
  console.log(`Program ID: ${programId.toString()}`);
  console.log();

  // Example asset ID
  const assetId = 12345;
  
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

  console.log("📋 PDA Addresses (for Asset ID: 12345)");
  console.log("=====================================");
  console.log(`Asset PDA: ${assetPda.toString()}`);
  console.log(`Escrow PDA: ${escrowPda.toString()}`);
  console.log(`Revenue Pool PDA: ${revenuePoolPda.toString()}`);
  console.log();

  console.log("🔧 Seed Derivation");
  console.log("==================");
  console.log(`Asset seed: "asset" + ${assetId}`);
  console.log(`Escrow seed: "escrow" + ${assetPda.toString()}`);
  console.log(`Revenue Pool seed: "revenue_pool" + ${assetPda.toString()}`);
  console.log();

  console.log("📝 For Frontend/Backend Integration");
  console.log("===================================");
  console.log("Program ID:", programId.toString());
  console.log("Network: Devnet");
  console.log("RPC URL: https://api.devnet.solana.com");
  console.log();

  // Generate example addresses for different asset IDs
  console.log("📊 Example Addresses for Different Asset IDs");
  console.log("=============================================");
  
  for (let i = 1; i <= 5; i++) {
    const [exampleAssetPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("asset"), Buffer.from(i.toString().padStart(16, '0'), 'hex')],
      programId
    );
    console.log(`Asset ID ${i}: ${exampleAssetPda.toString()}`);
  }

  console.log();
  console.log("✅ All addresses generated successfully!");
  console.log("💡 Use these addresses in your frontend/backend integration");
}

getAddresses().catch(console.error);
