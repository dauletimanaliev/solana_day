// Real Wallet Integration
// =======================

class WalletManager {
    constructor() {
        this.connectedWallet = null;
        this.walletAddress = null;
        this.isConnected = false;
        this.walletAdapters = {
            phantom: null,
            metamask: null
        };
        this.init();
    }

    async init() {
        // Check for Phantom wallet
        if (window.solana && window.solana.isPhantom) {
            this.walletAdapters.phantom = window.solana;
            console.log('✅ Phantom wallet detected');
        } else {
            console.log('⚠️ Phantom wallet not detected');
        }

        // Check for MetaMask
        if (window.ethereum && window.ethereum.isMetaMask) {
            this.walletAdapters.metamask = window.ethereum;
            console.log('✅ MetaMask wallet detected');
        } else {
            console.log('⚠️ MetaMask wallet not detected');
        }

        // Auto-connect if previously connected
        const savedWallet = localStorage.getItem('connectedWallet');
        if (savedWallet && this.walletAdapters[savedWallet]) {
            try {
                await this.connect(savedWallet);
                console.log(`✅ Auto-connected to ${savedWallet}`);
            } catch (error) {
                console.log(`⚠️ Auto-connect failed for ${savedWallet}:`, error.message);
                // Clear saved wallet if connection failed
                localStorage.removeItem('connectedWallet');
                localStorage.removeItem('walletAddress');
            }
        }
    }

    async connect(walletType) {
        try {
            if (walletType === 'phantom') {
                return await this.connectPhantom();
            } else if (walletType === 'metamask') {
                return await this.connectMetaMask();
            } else {
                throw new Error('Unsupported wallet type');
            }
        } catch (error) {
            console.error('Wallet connection failed:', error);
            throw error;
        }
    }

    async connectPhantom() {
        if (!this.walletAdapters.phantom) {
            // Try to detect Phantom wallet
            if (window.solana && window.solana.isPhantom) {
                this.walletAdapters.phantom = window.solana;
            } else {
                throw new Error('Phantom wallet not detected. Please install Phantom wallet from https://phantom.app');
            }
        }

        try {
            // Check if already connected
            if (this.walletAdapters.phantom.isConnected) {
                const response = await this.walletAdapters.phantom.connect({ onlyIfTrusted: false });
                this.connectedWallet = 'phantom';
                this.walletAddress = response.publicKey.toString();
                this.isConnected = true;
            } else {
                // Request connection
                const response = await this.walletAdapters.phantom.connect();
                this.connectedWallet = 'phantom';
                this.walletAddress = response.publicKey.toString();
                this.isConnected = true;
            }
            
            // Save to localStorage
            localStorage.setItem('connectedWallet', 'phantom');
            localStorage.setItem('walletAddress', this.walletAddress);
            
            return {
                wallet: 'phantom',
                address: this.walletAddress,
                publicKey: this.walletAdapters.phantom.publicKey
            };
        } catch (error) {
            console.error('Phantom connection error:', error);
            if (error.code === 4001) {
                throw new Error('User rejected the connection request');
            } else if (error.message.includes('User rejected')) {
                throw new Error('User rejected the connection request');
            } else {
                throw new Error('Failed to connect to Phantom wallet. Please try again.');
            }
        }
    }

    async connectMetaMask() {
        if (!this.walletAdapters.metamask) {
            // Try to detect MetaMask
            if (window.ethereum && window.ethereum.isMetaMask) {
                this.walletAdapters.metamask = window.ethereum;
            } else {
                throw new Error('MetaMask not detected. Please install MetaMask wallet from https://metamask.io');
            }
        }

        try {
            // Check if already connected
            const accounts = await this.walletAdapters.metamask.request({
                method: 'eth_accounts'
            });
            
            if (accounts.length > 0) {
                // Already connected
                this.connectedWallet = 'metamask';
                this.walletAddress = accounts[0];
                this.isConnected = true;
            } else {
                // Request connection
                const newAccounts = await this.walletAdapters.metamask.request({
                    method: 'eth_requestAccounts'
                });
                
                this.connectedWallet = 'metamask';
                this.walletAddress = newAccounts[0];
                this.isConnected = true;
            }
            
            // Save to localStorage
            localStorage.setItem('connectedWallet', 'metamask');
            localStorage.setItem('walletAddress', this.walletAddress);
            
            return {
                wallet: 'metamask',
                address: this.walletAddress,
                accounts: accounts
            };
        } catch (error) {
            console.error('MetaMask connection error:', error);
            if (error.code === 4001) {
                throw new Error('User rejected the connection request');
            } else if (error.message.includes('User rejected')) {
                throw new Error('User rejected the connection request');
            } else {
                throw new Error('Failed to connect to MetaMask wallet. Please try again.');
            }
        }
    }

    async disconnect() {
        try {
            if (this.connectedWallet === 'phantom' && this.walletAdapters.phantom) {
                await this.walletAdapters.phantom.disconnect();
            }
            
            this.connectedWallet = null;
            this.walletAddress = null;
            this.isConnected = false;
            
            // Clear localStorage
            localStorage.removeItem('connectedWallet');
            localStorage.removeItem('walletAddress');
            
            return true;
        } catch (error) {
            console.error('Wallet disconnection failed:', error);
            throw error;
        }
    }

    async signMessage(message) {
        if (!this.isConnected) {
            throw new Error('No wallet connected');
        }

        try {
            if (this.connectedWallet === 'phantom') {
                const encodedMessage = new TextEncoder().encode(message);
                const signature = await this.walletAdapters.phantom.signMessage(encodedMessage);
                return signature;
            } else if (this.connectedWallet === 'metamask') {
                const signature = await this.walletAdapters.metamask.request({
                    method: 'personal_sign',
                    params: [message, this.walletAddress]
                });
                return signature;
            }
        } catch (error) {
            console.error('Message signing failed:', error);
            throw error;
        }
    }

    async sendTransaction(transaction) {
        if (!this.isConnected) {
            throw new Error('No wallet connected');
        }

        try {
            if (this.connectedWallet === 'phantom') {
                const signature = await this.walletAdapters.phantom.signAndSendTransaction(transaction);
                return signature;
            } else if (this.connectedWallet === 'metamask') {
                const txHash = await this.walletAdapters.metamask.request({
                    method: 'eth_sendTransaction',
                    params: [transaction]
                });
                return txHash;
            }
        } catch (error) {
            console.error('Transaction failed:', error);
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

    // Event listeners for wallet changes
    setupEventListeners() {
        // Phantom events
        if (this.walletAdapters.phantom) {
            this.walletAdapters.phantom.on('accountChanged', (publicKey) => {
                if (publicKey) {
                    this.walletAddress = publicKey.toString();
                    localStorage.setItem('walletAddress', this.walletAddress);
                } else {
                    this.disconnect();
                }
                this.onWalletChange();
            });
        }

        // MetaMask events
        if (this.walletAdapters.metamask) {
            this.walletAdapters.metamask.on('accountsChanged', (accounts) => {
                if (accounts.length > 0) {
                    this.walletAddress = accounts[0];
                    localStorage.setItem('walletAddress', this.walletAddress);
                } else {
                    this.disconnect();
                }
                this.onWalletChange();
            });

            this.walletAdapters.metamask.on('chainChanged', (chainId) => {
                console.log('Chain changed:', chainId);
                this.onWalletChange();
            });
        }
    }

    onWalletChange() {
        // Trigger custom event for UI updates
        window.dispatchEvent(new CustomEvent('walletChanged', {
            detail: this.getWalletInfo()
        }));
    }
}

// Global wallet manager instance
window.walletManager = new WalletManager();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WalletManager;
}
