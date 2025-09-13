import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AssetTokenization } from "../target/types/asset_tokenization";
import { expect } from "chai";

describe("asset_tokenization", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.AssetTokenization as Program<AssetTokenization>;
  const provider = anchor.getProvider();

  // Test accounts
  const creator = anchor.web3.Keypair.generate();
  const buyer = anchor.web3.Keypair.generate();
  const assetId = new anchor.BN(12345);
  const metadataUri = "https://example.com/metadata.json";
  const totalSupply = new anchor.BN(1000000);

  before(async () => {
    // Airdrop SOL to test accounts
    await provider.connection.requestAirdrop(creator.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL);
    await provider.connection.requestAirdrop(buyer.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL);
    
    // Wait for airdrop confirmation
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  it("Creates an asset", async () => {
    // Derive PDAs
    const [assetPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("asset"), assetId.toArrayLike(Buffer, "le", 8)],
      program.programId
    );

    const [escrowPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("escrow"), assetPda.toBytes()],
      program.programId
    );

    const [revenuePoolPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("revenue_pool"), assetPda.toBytes()],
      program.programId
    );

    // Create asset
    const tx = await program.methods
      .createAsset(assetId, metadataUri, totalSupply)
      .accounts({
        asset: assetPda,
        escrow: escrowPda,
        revenuePool: revenuePoolPda,
        creator: creator.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([creator])
      .rpc();

    console.log("Create asset transaction signature:", tx);

    // Verify asset was created
    const assetAccount = await program.account.asset.fetch(assetPda);
    expect(assetAccount.id.toString()).to.equal(assetId.toString());
    expect(assetAccount.creator.toString()).to.equal(creator.publicKey.toString());
    expect(assetAccount.metadataUri).to.equal(metadataUri);
    expect(assetAccount.totalSupply.toString()).to.equal(totalSupply.toString());
    expect(assetAccount.remainingSupply.toString()).to.equal(totalSupply.toString());
  });

  it("Mints fraction tokens", async () => {
    // Derive PDAs
    const [assetPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("asset"), assetId.toArrayLike(Buffer, "le", 8)],
      program.programId
    );

    const [escrowPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("escrow"), assetPda.toBytes()],
      program.programId
    );

    const mintAmount = new anchor.BN(100000);

    // Mint fraction tokens
    const tx = await program.methods
      .mintFractionTokens(mintAmount)
      .accounts({
        asset: assetPda,
        escrow: escrowPda,
      })
      .rpc();

    console.log("Mint fraction tokens transaction signature:", tx);

    // Verify tokens were minted
    const assetAccount = await program.account.asset.fetch(assetPda);
    const expectedRemainingSupply = totalSupply.sub(mintAmount);
    expect(assetAccount.remainingSupply.toString()).to.equal(expectedRemainingSupply.toString());
  });

  it("Buys fractions", async () => {
    // Derive PDAs
    const [assetPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("asset"), assetId.toArrayLike(Buffer, "le", 8)],
      program.programId
    );

    const [escrowPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("escrow"), assetPda.toBytes()],
      program.programId
    );

    const buyAmount = new anchor.BN(50000);

    // Buy fractions
    const tx = await program.methods
      .buyFractions(buyAmount)
      .accounts({
        asset: assetPda,
        escrow: escrowPda,
        buyer: buyer.publicKey,
      })
      .signers([buyer])
      .rpc();

    console.log("Buy fractions transaction signature:", tx);

    // Verify fractions were bought
    const escrowAccount = await program.account.escrow.fetch(escrowPda);
    const expectedEscrowAmount = new anchor.BN(100000).sub(buyAmount);
    expect(escrowAccount.amount.toString()).to.equal(expectedEscrowAmount.toString());
  });

  it("Distributes revenue", async () => {
    // Derive PDAs
    const [assetPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("asset"), assetId.toArrayLike(Buffer, "le", 8)],
      program.programId
    );

    const [revenuePoolPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("revenue_pool"), assetPda.toBytes()],
      program.programId
    );

    const revenueAmount = new anchor.BN(1000);

    // Distribute revenue
    const tx = await program.methods
      .distributeRevenue(revenueAmount)
      .accounts({
        revenuePool: revenuePoolPda,
        asset: assetPda,
        creator: creator.publicKey,
      })
      .signers([creator])
      .rpc();

    console.log("Distribute revenue transaction signature:", tx);

    // Verify revenue was distributed
    const revenuePoolAccount = await program.account.revenuePool.fetch(revenuePoolPda);
    expect(revenuePoolAccount.totalRevenue.toString()).to.equal(revenueAmount.toString());
    expect(revenuePoolAccount.distributedRevenue.toString()).to.equal(revenueAmount.toString());
  });

  it("Fails to mint more tokens than available supply", async () => {
    // Derive PDAs
    const [assetPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("asset"), assetId.toArrayLike(Buffer, "le", 8)],
      program.programId
    );

    const [escrowPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("escrow"), assetPda.toBytes()],
      program.programId
    );

    const excessiveAmount = new anchor.BN(10000000); // More than remaining supply

    try {
      await program.methods
        .mintFractionTokens(excessiveAmount)
        .accounts({
          asset: assetPda,
          escrow: escrowPda,
        })
        .rpc();
      
      expect.fail("Expected transaction to fail");
    } catch (error) {
      expect(error.message).to.include("InsufficientSupply");
    }
  });

  it("Fails to buy more fractions than available in escrow", async () => {
    // Derive PDAs
    const [assetPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("asset"), assetId.toArrayLike(Buffer, "le", 8)],
      program.programId
    );

    const [escrowPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("escrow"), assetPda.toBytes()],
      program.programId
    );

    const excessiveAmount = new anchor.BN(10000000); // More than available in escrow

    try {
      await program.methods
        .buyFractions(excessiveAmount)
        .accounts({
          asset: assetPda,
          escrow: escrowPda,
          buyer: buyer.publicKey,
        })
        .signers([buyer])
        .rpc();
      
      expect.fail("Expected transaction to fail");
    } catch (error) {
      expect(error.message).to.include("InsufficientTokenBalance");
    }
  });
});