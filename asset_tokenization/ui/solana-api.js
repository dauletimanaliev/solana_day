
// Solana API Integration
// ======================

class SolanaAPI {
    constructor() {
        this.connection = null;
        this.network = 'devnet'; // или 'mainnet-beta'
        this.init();
    }

    async init() {
        // Загружаем Solana Web3.js из CDN
        if (typeof window !== 'undefined' && !window.solanaWeb3) {
            await this.loadSolanaWeb3();
        }
        
        if (window.solanaWeb3) {
            this.connection = new window.solanaWeb3.Connection(
                window.solanaWeb3.clusterApiUrl(this.network),
                'confirmed'
            );
            console.log('✅ Solana API подключен к', this.network);
        }
    }

    async loadSolanaWeb3() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/@solana/web3.js@latest/lib/index.iife.min.js';
            script.onload = () => {
                console.log('✅ Solana Web3.js загружен');
                resolve();
            };
            script.onerror = () => {
                console.error('❌ Ошибка загрузки Solana Web3.js');
                reject(new Error('Failed to load Solana Web3.js'));
            };
            document.head.appendChild(script);
        });
    }

    // Получить баланс кошелька
    async getBalance(publicKey) {
        if (!this.connection) {
            throw new Error('Solana API не инициализирован');
        }

        try {
            const balance = await this.connection.getBalance(publicKey);
            return balance / window.solanaWeb3.LAMPORTS_PER_SOL; // Конвертируем в SOL
        } catch (error) {
            console.error('Ошибка получения баланса:', error);
            throw error;
        }
    }

    // Получить информацию об аккаунте
    async getAccountInfo(publicKey) {
        if (!this.connection) {
            throw new Error('Solana API не инициализирован');
        }

        try {
            const accountInfo = await this.connection.getAccountInfo(publicKey);
            return accountInfo;
        } catch (error) {
            console.error('Ошибка получения информации об аккаунте:', error);
            throw error;
        }
    }

    // Отправить SOL
    async sendSOL(fromWallet, toAddress, amount) {
        if (!this.connection) {
            throw new Error('Solana API не инициализирован');
        }

        try {
            const fromPublicKey = fromWallet.publicKey;
            const toPublicKey = new window.solanaWeb3.PublicKey(toAddress);
            const lamports = amount * window.solanaWeb3.LAMPORTS_PER_SOL;

            // Создаем транзакцию
            const transaction = new window.solanaWeb3.Transaction().add(
                window.solanaWeb3.SystemProgram.transfer({
                    fromPubkey: fromPublicKey,
                    toPubkey: toPublicKey,
                    lamports: lamports,
                })
            );

            // Получаем последний блок
            const { blockhash } = await this.connection.getRecentBlockhash();
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = fromPublicKey;

            // Подписываем и отправляем транзакцию
            const signature = await fromWallet.signAndSendTransaction(transaction);
            
            // Ждем подтверждения
            await this.connection.confirmTransaction(signature);
            
            return signature;
        } catch (error) {
            console.error('Ошибка отправки SOL:', error);
            throw error;
        }
    }

    // Создать новый кошелек
    createWallet() {
        if (!window.solanaWeb3) {
            throw new Error('Solana Web3.js не загружен');
        }

        const keypair = window.solanaWeb3.Keypair.generate();
        return {
            publicKey: keypair.publicKey,
            secretKey: keypair.secretKey,
            address: keypair.publicKey.toString()
        };
    }

    // Получить информацию о сети
    async getNetworkInfo() {
        if (!this.connection) {
            throw new Error('Solana API не инициализирован');
        }

        try {
            const version = await this.connection.getVersion();
            const blockHeight = await this.connection.getBlockHeight();
            const slot = await this.connection.getSlot();
            
            return {
                version: version['solana-core'],
                blockHeight: blockHeight,
                slot: slot,
                network: this.network
            };
        } catch (error) {
            console.error('Ошибка получения информации о сети:', error);
            throw error;
        }
    }

    // Получить историю транзакций
    async getTransactionHistory(publicKey, limit = 10) {
        if (!this.connection) {
            throw new Error('Solana API не инициализирован');
        }

        try {
            const signatures = await this.connection.getSignaturesForAddress(publicKey, { limit });
            const transactions = [];
            
            for (const sig of signatures) {
                try {
                    const tx = await this.connection.getTransaction(sig.signature);
                    transactions.push({
                        signature: sig.signature,
                        slot: sig.slot,
                        blockTime: sig.blockTime,
                        transaction: tx
                    });
                } catch (error) {
                    console.warn('Ошибка получения транзакции:', sig.signature, error);
                }
            }
            
            return transactions;
        } catch (error) {
            console.error('Ошибка получения истории транзакций:', error);
            throw error;
        }
    }

    // Создать токен (SPL Token)
    async createToken(wallet, name, symbol, decimals = 9, initialSupply = 1000000) {
        if (!this.connection) {
            throw new Error('Solana API не инициализирован');
        }

        try {
            // Создаем новый mint аккаунт
            const mintKeypair = window.solanaWeb3.Keypair.generate();
            
            // Создаем транзакцию для создания токена
            const transaction = new window.solanaWeb3.Transaction().add(
                window.solanaWeb3.SystemProgram.createAccount({
                    fromPubkey: wallet.publicKey,
                    newAccountPubkey: mintKeypair.publicKey,
                    space: 82, // Размер mint аккаунта
                    lamports: await this.connection.getMinimumBalanceForRentExemption(82),
                    programId: window.solanaWeb3.TOKEN_PROGRAM_ID,
                }),
                window.solanaWeb3.Token.createInitializeMintInstruction(
                    mintKeypair.publicKey,
                    decimals,
                    wallet.publicKey,
                    wallet.publicKey
                )
            );

            const { blockhash } = await this.connection.getRecentBlockhash();
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = wallet.publicKey;

            const signature = await wallet.signAndSendTransaction(transaction);
            await this.connection.confirmTransaction(signature);

            return {
                mintAddress: mintKeypair.publicKey.toString(),
                signature: signature,
                name: name,
                symbol: symbol,
                decimals: decimals
            };
        } catch (error) {
            console.error('Ошибка создания токена:', error);
            throw error;
        }
    }

    // Получить информацию о токене
    async getTokenInfo(mintAddress) {
        if (!this.connection) {
            throw new Error('Solana API не инициализирован');
        }

        try {
            const mintPublicKey = new window.solanaWeb3.PublicKey(mintAddress);
            const mintInfo = await this.connection.getParsedAccountInfo(mintPublicKey);
            
            return mintInfo.value?.data?.parsed?.info || null;
        } catch (error) {
            console.error('Ошибка получения информации о токене:', error);
            throw error;
        }
    }
}

// Глобальный экземпляр Solana API
window.solanaAPI = new SolanaAPI();

// Экспорт для модульных систем
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SolanaAPI;
}
