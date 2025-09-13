// Solana Wallet Integration using Official Wallet Adapter
// ======================================================

class SolanaWalletManager {
    constructor() {
        this.connectedWallet = null;
        this.walletAddress = null;
        this.isConnected = false;
        this.connection = null;
        this.wallet = null;
        this.init();
    }

    async init() {
        console.log('🔧 Initializing Solana Wallet Manager...');
        
        // Check if we're in a browser environment
        if (typeof window === 'undefined') {
            console.log('⚠️ Not in browser environment');
            return;
        }

        // Wait for wallet to be available
        await this.waitForWallet();
        
        // Auto-connect if previously connected
        const savedWallet = localStorage.getItem('connectedWallet');
        if (savedWallet) {
            try {
                await this.connect(savedWallet);
                console.log(`✅ Auto-connected to ${savedWallet}`);
            } catch (error) {
                console.log(`⚠️ Auto-connect failed:`, error.message);
                localStorage.removeItem('connectedWallet');
                localStorage.removeItem('walletAddress');
            }
        }
    }

    async waitForWallet() {
        return new Promise((resolve) => {
            const checkWallet = () => {
                if (window.solana || window.ethereum) {
                    resolve();
                } else {
                    setTimeout(checkWallet, 100);
                }
            };
            checkWallet();
        });
    }

    async connect(walletType) {
        try {
            console.log(`🔌 Attempting to connect to ${walletType}...`);
            
            if (walletType === 'phantom') {
                return await this.connectPhantom();
            } else if (walletType === 'metamask') {
                return await this.connectMetaMask();
            } else {
                throw new Error('Unsupported wallet type');
            }
        } catch (error) {
            console.error('❌ Wallet connection failed:', error);
            throw error;
        }
    }

    async connectPhantom() {
        // Check if Phantom is available
        if (!window.solana || !window.solana.isPhantom) {
            throw new Error('Phantom wallet not detected. Please install Phantom wallet from https://phantom.app');
        }

        try {
            console.log('👻 Connecting to Phantom...');
            
            // Check if already connected
            if (window.solana.isConnected) {
                console.log('✅ Already connected to Phantom');
                this.connectedWallet = 'phantom';
                this.walletAddress = window.solana.publicKey.toString();
                this.isConnected = true;
            } else {
                // Request connection - this should open the Phantom popup
                console.log('🔄 Requesting Phantom connection...');
                const response = await window.solana.connect();
                
                this.connectedWallet = 'phantom';
                this.walletAddress = response.publicKey.toString();
                this.isConnected = true;
                
                console.log('✅ Phantom connected successfully:', this.walletAddress);
            }
            
            // Save to localStorage
            localStorage.setItem('connectedWallet', 'phantom');
            localStorage.setItem('walletAddress', this.walletAddress);
            
            // Set up event listeners
            this.setupPhantomListeners();
            
            return {
                wallet: 'phantom',
                address: this.walletAddress,
                publicKey: window.solana.publicKey
            };
        } catch (error) {
            console.error('❌ Phantom connection error:', error);
            if (error.code === 4001) {
                throw new Error('User rejected the connection request');
            } else if (error.message.includes('User rejected')) {
                throw new Error('User rejected the connection request');
            } else {
                throw new Error(`Failed to connect to Phantom: ${error.message}`);
            }
        }
    }

    async connectMetaMask() {
        // Check if MetaMask is available
        if (!window.ethereum || !window.ethereum.isMetaMask) {
            throw new Error('MetaMask wallet not detected. Please install MetaMask wallet from https://metamask.io');
        }

        try {
            console.log('🦊 Connecting to MetaMask...');
            
            // Check if already connected
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            
            if (accounts.length > 0) {
                console.log('✅ Already connected to MetaMask');
                this.connectedWallet = 'metamask';
                this.walletAddress = accounts[0];
                this.isConnected = true;
            } else {
                // Request connection - this should open the MetaMask popup
                console.log('🔄 Requesting MetaMask connection...');
                const newAccounts = await window.ethereum.request({
                    method: 'eth_requestAccounts'
                });
                
                this.connectedWallet = 'metamask';
                this.walletAddress = newAccounts[0];
                this.isConnected = true;
                
                console.log('✅ MetaMask connected successfully:', this.walletAddress);
            }
            
            // Save to localStorage
            localStorage.setItem('connectedWallet', 'metamask');
            localStorage.setItem('walletAddress', this.walletAddress);
            
            // Set up event listeners
            this.setupMetaMaskListeners();
            
            return {
                wallet: 'metamask',
                address: this.walletAddress,
                accounts: accounts
            };
        } catch (error) {
            console.error('❌ MetaMask connection error:', error);
            if (error.code === 4001) {
                throw new Error('User rejected the connection request');
            } else if (error.message.includes('User rejected')) {
                throw new Error('User rejected the connection request');
            } else {
                throw new Error(`Failed to connect to MetaMask: ${error.message}`);
            }
        }
    }

    setupPhantomListeners() {
        if (window.solana) {
            window.solana.on('accountChanged', (publicKey) => {
                console.log('🔄 Phantom account changed:', publicKey);
                if (publicKey) {
                    this.walletAddress = publicKey.toString();
                    localStorage.setItem('walletAddress', this.walletAddress);
                } else {
                    this.disconnect();
                }
                this.onWalletChange();
            });

            window.solana.on('disconnect', () => {
                console.log('🔌 Phantom disconnected');
                this.disconnect();
            });
        }
    }

    setupMetaMaskListeners() {
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts) => {
                console.log('🔄 MetaMask accounts changed:', accounts);
                if (accounts.length > 0) {
                    this.walletAddress = accounts[0];
                    localStorage.setItem('walletAddress', this.walletAddress);
                } else {
                    this.disconnect();
                }
                this.onWalletChange();
            });

            window.ethereum.on('chainChanged', (chainId) => {
                console.log('🔄 MetaMask chain changed:', chainId);
                this.onWalletChange();
            });

            window.ethereum.on('disconnect', () => {
                console.log('🔌 MetaMask disconnected');
                this.disconnect();
            });
        }
    }

    async disconnect() {
        try {
            console.log('🔌 Disconnecting wallet...');
            
            if (this.connectedWallet === 'phantom' && window.solana) {
                await window.solana.disconnect();
            }
            
            this.connectedWallet = null;
            this.walletAddress = null;
            this.isConnected = false;
            
            // Clear localStorage
            localStorage.removeItem('connectedWallet');
            localStorage.removeItem('walletAddress');
            
            console.log('✅ Wallet disconnected');
            this.onWalletChange();
            
            return true;
        } catch (error) {
            console.error('❌ Wallet disconnection failed:', error);
            throw error;
        }
    }

    async signMessage(message) {
        if (!this.isConnected) {
            throw new Error('No wallet connected');
        }

        try {
            if (this.connectedWallet === 'phantom' && window.solana) {
                const encodedMessage = new TextEncoder().encode(message);
                const signature = await window.solana.signMessage(encodedMessage);
                return signature;
            } else if (this.connectedWallet === 'metamask' && window.ethereum) {
                const signature = await window.ethereum.request({
                    method: 'personal_sign',
                    params: [message, this.walletAddress]
                });
                return signature;
            }
        } catch (error) {
            console.error('❌ Message signing failed:', error);
            throw error;
        }
    }

    async sendTransaction(transaction) {
        if (!this.isConnected) {
            throw new Error('No wallet connected');
        }

        try {
            if (this.connectedWallet === 'phantom' && window.solana) {
                const signature = await window.solana.signAndSendTransaction(transaction);
                return signature;
            } else if (this.connectedWallet === 'metamask' && window.ethereum) {
                const txHash = await window.ethereum.request({
                    method: 'eth_sendTransaction',
                    params: [transaction]
                });
                return txHash;
            }
        } catch (error) {
            console.error('❌ Transaction failed:', error);
            throw error;
        }
    }

    getWalletInfo() {
        return {
            isConnected: this.isConnected,
            wallet: this.connectedWallet,
            address: this.walletAddress,
            shortAddress: this.walletAddress ? `${this.walletAddress.slice(0, 4)}...${this.walletAddress.slice(-4)}` : null
        };
    }

    onWalletChange() {
        // Trigger custom event for UI updates
        window.dispatchEvent(new CustomEvent('walletChanged', {
            detail: this.getWalletInfo()
        }));
    }

    // Check if wallet is available
    isWalletAvailable(walletType) {
        if (walletType === 'phantom') {
            return !!(window.solana && window.solana.isPhantom);
        } else if (walletType === 'metamask') {
            return !!(window.ethereum && window.ethereum.isMetaMask);
        }
        return false;
    }
}

// Global wallet manager instance
window.solanaWalletManager = new SolanaWalletManager();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SolanaWalletManager;
}
