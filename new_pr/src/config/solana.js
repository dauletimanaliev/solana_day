const { Connection, PublicKey, Keypair } = require('@solana/web3.js');
const { AnchorProvider, Program } = require('@coral-xyz/anchor');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

class SolanaConfig {
  constructor() {
    this.connection = new Connection(
      process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com',
      'confirmed'
    );
    
    this.programId = new PublicKey(process.env.ANCHOR_PROGRAM_ID || '11111111111111111111111111111111');
    
    // Initialize keypair from private key
    this.wallet = this.initializeWallet();
    
    // Initialize Anchor provider
    this.provider = new AnchorProvider(
      this.connection,
      this.wallet,
      { commitment: 'confirmed' }
    );
    
    // Load Anchor program
    this.program = this.loadProgram();
  }

  initializeWallet() {
    try {
      const privateKey = process.env.SOLANA_PRIVATE_KEY;
      if (!privateKey || privateKey === 'your_private_key_here') {
        console.warn('SOLANA_PRIVATE_KEY not configured, generating new keypair for development');
        return Keypair.generate();
      }
      
      // Convert private key string to Uint8Array
      const privateKeyArray = new Uint8Array(
        privateKey.split(',').map(key => parseInt(key))
      );
      
      return Keypair.fromSecretKey(privateKeyArray);
    } catch (error) {
      console.warn('Failed to load wallet from environment, generating new keypair');
      return Keypair.generate();
    }
  }

  loadProgram() {
    try {
      // This would typically load the IDL file
      // For now, we'll create a mock program structure
      return {
        methods: {
          createAsset: () => {},
          mintFractionTokens: () => {},
          buyFractions: () => {},
          distributeRevenue: () => {}
        }
      };
    } catch (error) {
      console.error('Failed to load Anchor program:', error);
      throw error;
    }
  }

  getConnection() {
    return this.connection;
  }

  getWallet() {
    return this.wallet;
  }

  getProvider() {
    return this.provider;
  }

  getProgram() {
    return this.program;
  }

  getProgramId() {
    return this.programId;
  }
}

module.exports = new SolanaConfig();
