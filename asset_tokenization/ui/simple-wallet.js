// Simple Wallet Integration - Only Phantom + Alert Dialog
// =====================================================

class SimpleWalletManager {
    constructor() {
        this.connectedWallet = null;
        this.walletAddress = null;
        this.isConnected = false;
        this.init();
    }

    async init() {
        console.log('🔧 Initializing Simple Wallet Manager...');
        
        // Check if we're in a browser environment
        if (typeof window === 'undefined') {
            console.log('⚠️ Not in browser environment');
            return;
        }

        // Wait for Phantom to be available
        await this.waitForPhantom();
        
        // Auto-connect if previously connected
        const savedWallet = localStorage.getItem('connectedWallet');
        if (savedWallet === 'phantom') {
            try {
                await this.connectPhantom();
                console.log(`✅ Auto-connected to Phantom`);
            } catch (error) {
                console.log(`⚠️ Auto-connect failed:`, error.message);
                localStorage.removeItem('connectedWallet');
                localStorage.removeItem('walletAddress');
            }
        }
    }

    async waitForPhantom() {
        return new Promise((resolve) => {
            const checkPhantom = () => {
                if (window.solana && window.solana.isPhantom) {
                    resolve();
                } else {
                    setTimeout(checkPhantom, 100);
                }
            };
            checkPhantom();
        });
    }

    async connectPhantom() {
        // Check if Phantom is available
        if (!window.solana || !window.solana.isPhantom) {
            throw new Error('Phantom wallet not detected');
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
                
                // Force Phantom to open by using connect with specific parameters
                let response;
                try {
                    // Method 1: Force connect with specific parameters to trigger popup
                    response = await window.solana.connect({
                        onlyIfTrusted: false,
                        silent: false
                    });
                } catch (error) {
                    if (error.code === 4001) {
                        throw error; // User rejected
                    }
                    // Method 2: Try standard connect
                    try {
                        response = await window.solana.connect();
                    } catch (error2) {
                        if (error2.code === 4001) {
                            throw error2; // User rejected
                        }
                        // Method 3: Try with different parameters
                        response = await window.solana.connect({ 
                            onlyIfTrusted: false
                        });
                    }
                }
                
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

    // Check if Phantom is available
    isPhantomAvailable() {
        return !!(window.solana && window.solana.isPhantom);
    }

    // Simple connect function with toast
    async connect() {
        if (!this.isPhantomAvailable()) {
            this.showToast('Ошибка', 'Phantom кошелек не установлен! Установите Phantom кошелек с https://phantom.app', 'error');
            return false;
        }

        try {
            // Force Phantom to open by triggering a click event on the extension
            if (window.solana && window.solana.connect) {
                // Try to trigger Phantom popup by calling connect directly
                console.log('🔄 Forcing Phantom popup...');
                
                // Add a small delay to ensure Phantom is ready
                await new Promise(resolve => setTimeout(resolve, 100));
                
                const result = await this.connectPhantom();
                console.log(`✅ Phantom подключен: ${result.address}`);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Connection error:', error);
            return false;
        }
    }

    // Simple disconnect function with toast
    async disconnectWithAlert() {
        try {
            await this.disconnect();
            this.showToast('Успех', 'Кошелек отключен', 'success');
            return true;
        } catch (error) {
            this.showToast('Ошибка', `Ошибка отключения: ${error.message}`, 'error');
            return false;
        }
    }

    // Force Phantom popup to open
    async forcePhantomPopup() {
        if (!this.isPhantomAvailable()) {
            return false;
        }

        try {
            console.log('🔄 Forcing Phantom popup to open...');
            
            // Try multiple methods to force Phantom popup
            if (window.solana && window.solana.connect) {
                // Method 1: Direct connect call
                try {
                    await window.solana.connect({ onlyIfTrusted: false, silent: false });
                    return true;
                } catch (error) {
                    if (error.code === 4001) {
                        return true; // User rejected, but popup opened
                    }
                }
                
                // Method 2: Try with different parameters
                try {
                    await window.solana.connect();
                    return true;
                } catch (error) {
                    if (error.code === 4001) {
                        return true; // User rejected, but popup opened
                    }
                }
            }
            
            return false;
        } catch (error) {
            console.error('Force popup error:', error);
            return false;
        }
    }

    // Show toast notification
    showToast(title, message, type = 'info') {
        // Check if showToast function exists globally
        if (typeof window.showToast === 'function') {
            window.showToast(title, message, type);
        } else {
            // Fallback to console log
            console.log(`[${type.toUpperCase()}] ${title}: ${message}`);
        }
    }
}

// Global wallet manager instance
window.simpleWalletManager = new SimpleWalletManager();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SimpleWalletManager;
}
