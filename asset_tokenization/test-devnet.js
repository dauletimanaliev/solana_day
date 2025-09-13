const anchor = require("@coral-xyz/anchor");
const { PublicKey, Keypair } = require("@solana/web3.js");

async function testOnDevnet() {
  console.log("🚀 Testing Asset Tokenization on Devnet");
  console.log("=====================================");

  // Program ID
  const programId = new PublicKey("FuAVoPCtaJWnJZVxE2ii4CtiqPwgvmxLE7gkGv5udmjQ");
  
  // Create test accounts
  const creator = Keypair.generate();
  const buyer = Keypair.generate();
  
  console.log(`Creator: ${creator.publicKey.toString()}`);
  console.log(`Buyer: ${buyer.publicKey.toString()}`);
  console.log();

  // Airdrop SOL to test accounts
  console.log("💰 Requesting airdrop...");
  try {
    const connection = new anchor.web3.Connection("https://api.devnet.solana.com");
    
    // Airdrop to creator
    const creatorAirdrop = await connection.requestAirdrop(creator.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL);
    await connection.confirmTransaction(creatorAirdrop);
    console.log("✅ Creator airdropped 2 SOL");
    
    // Airdrop to buyer
    const buyerAirdrop = await connection.requestAirdrop(buyer.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL);
    await connection.confirmTransaction(buyerAirdrop);
    console.log("✅ Buyer airdropped 2 SOL");
    
  } catch (error) {
    console.log("❌ Airdrop failed:", error.message);
    return;
  }

  // Test parameters
  const assetId = 12345;
  const metadataUri = "https://example.com/metadata.json";
  const totalSupply = 1000000;
  const mintAmount = 100000;
  const buyAmount = 50000;
  const revenueAmount = 1000;

  console.log();
  console.log("📋 Test Parameters");
  console.log("==================");
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

  console.log("🔍 PDA Addresses");
  console.log("================");
  console.log(`Asset PDA: ${assetPda.toString()}`);
  console.log(`Escrow PDA: ${escrowPda.toString()}`);
  console.log(`Revenue Pool PDA: ${revenuePoolPda.toString()}`);
  console.log();

  console.log("✅ Devnet test setup completed!");
  console.log("💡 Program is ready for deployment and testing");
  console.log();
  console.log("📝 Next steps:");
  console.log("1. Deploy program to devnet");
  console.log("2. Run integration tests");
  console.log("3. Test all instructions");
  console.log("4. Verify PDA accounts");
}

testOnDevnet().catch(console.error);
