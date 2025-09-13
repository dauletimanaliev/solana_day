// FRONTEND: Главный компонент приложения
// =====================================

import React, { useState, useEffect } from 'react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PROGRAM_CONFIG } from './config/config';
import { isWalletConnected, getWalletPublicKey } from './utils/utils';
import CreateAssetForm from './components/CreateAssetForm';
import AssetsList from './components/AssetsList';

// Импорт стилей
import '@solana/wallet-adapter-react-ui/styles.css';
import './App.css';

function App() {
  const [wallet, setWallet] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);

  useEffect(() => {
    // Инициализация кошелька
    const initWallet = async () => {
      const phantom = new PhantomWalletAdapter();
      await phantom.connect();
      setWallet(phantom);
      setWalletAddress(getWalletPublicKey(phantom));
    };

    initWallet();
  }, []);

  const handleWalletConnect = (wallet) => {
    setWallet(wallet);
    setWalletAddress(getWalletPublicKey(wallet));
  };

  const handleAssetCreated = (result) => {
    console.log('Asset created:', result);
    // Можно добавить уведомления или обновление состояния
  };

  return (
    <ConnectionProvider endpoint={PROGRAM_CONFIG.RPC_URL}>
      <WalletProvider wallets={[new PhantomWalletAdapter()]}>
        <WalletModalProvider>
          <div className="app">
            <header className="app-header">
              <h1>Asset Tokenization Platform</h1>
              <div className="wallet-section">
                <WalletMultiButton />
                {walletAddress && (
                  <div className="wallet-info">
                    <span>Подключен: {walletAddress.slice(0, 8)}...</span>
                  </div>
                )}
              </div>
            </header>

            <main className="app-main">
              <div className="container">
                {!isWalletConnected(wallet) ? (
                  <div className="wallet-required">
                    <h2>Подключите кошелек</h2>
                    <p>Для использования платформы необходимо подключить кошелек</p>
                  </div>
                ) : (
                  <>
                    <CreateAssetForm 
                      wallet={wallet}
                      onAssetCreated={handleAssetCreated}
                    />
                    
                    <AssetsList wallet={wallet} />
                  </>
                )}
              </div>
            </main>

            <footer className="app-footer">
              <p>Asset Tokenization Platform - Solana Blockchain</p>
              <p>Program ID: {PROGRAM_CONFIG.PROGRAM_ID}</p>
            </footer>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
