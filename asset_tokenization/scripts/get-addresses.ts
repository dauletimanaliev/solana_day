import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AssetTokenization } from "../target/types/asset_tokenization";

async function getAddresses() {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.AssetTokenization as Program<AssetTokenization>;
  const programId = program.programId;

  console.log("🚀 Asset Tokenization Program Addresses");
  console.log("=====================================");
  console.log(`Program ID: ${programId.toString()}`);
  console.log();

  // Example asset ID
  const assetId = new anchor.BN(12345);
  
  // Derive PDAs
  const [assetPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("asset"), assetId.toArrayLike(Buffer, "le", 8)],
    programId
  );

  const [escrowPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("escrow"), assetPda.toBytes()],
    programId
  );

  const [revenuePoolPda] = anchor.web3.PublicKey.findProgramAddressSync(
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
  console.log(`Asset seed: "asset" + ${assetId.toString()}`);
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
    const exampleAssetId = new anchor.BN(i);
    const [exampleAssetPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("asset"), exampleAssetId.toArrayLike(Buffer, "le", 8)],
      programId
    );
    console.log(`Asset ID ${i}: ${exampleAssetPda.toString()}`);
  }

  console.log();
  console.log("✅ All addresses generated successfully!");
  console.log("💡 Use these addresses in your frontend/backend integration");
}

getAddresses().catch(console.error);
