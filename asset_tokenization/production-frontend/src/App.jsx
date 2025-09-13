// ПРОДАКШЕН FRONTEND - Asset Tokenization Platform
// ================================================

import React, { useState, useEffect } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { PublicKey } from '@solana/web3.js';

// Компоненты (встроенные)
// import AssetCreationWizard from './components/AssetCreationWizard';
// import RevenueDistribution from './components/RevenueDistribution';
// import PortfolioAnalytics from './components/PortfolioAnalytics';
import AssetList from './components/AssetList';
import TransactionHistory from './components/TransactionHistory';

// Стили
import '@solana/wallet-adapter-react-ui/styles.css';
import './App.css';

// Конфигурация
const NETWORK = 'devnet';
const RPC_URL = 'https://api.devnet.solana.com';
const API_BASE_URL = 'http://localhost:3001';

// Поддерживаемые кошельки
const wallets = [new PhantomWalletAdapter()];

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [wallet, setWallet] = useState(null);
  const [apiStatus, setApiStatus] = useState('checking');
  const [assets, setAssets] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // Проверка статуса API
  useEffect(() => {
    checkApiStatus();
  }, []);

  const checkApiStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      const data = await response.json();
      
      if (data.status === 'healthy') {
        setApiStatus('connected');
        console.log('✅ API подключен:', data);
      } else {
        setApiStatus('error');
        console.error('❌ API недоступен:', data);
      }
    } catch (error) {
      setApiStatus('error');
      console.error('❌ Ошибка подключения к API:', error);
    }
  };

  const loadAssets = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/assets`);
      const data = await response.json();
      
      if (data.success) {
        setAssets(data.data);
      }
    } catch (error) {
      console.error('Ошибка загрузки активов:', error);
    }
  };

  const loadTransactions = async () => {
    try {
      // В реальном приложении здесь будет запрос к API
      setTransactions([]);
    } catch (error) {
      console.error('Ошибка загрузки транзакций:', error);
    }
  };

  const handleWalletConnect = (wallet) => {
    setWallet(wallet);
    console.log('Кошелек подключен:', wallet.publicKey?.toString());
  };

  const handleAssetCreated = (asset) => {
    console.log('Актив создан:', asset);
    loadAssets(); // Перезагружаем список активов
  };

  const renderView = () => {
    switch (currentView) {
      case 'create':
        return (
          <div className="dashboard">
            <h2>Создание актива</h2>
            <p>Функция создания актива будет добавлена в следующей версии</p>
            <button onClick={() => setCurrentView('dashboard')} className="btn">
              Вернуться к дашборду
            </button>
          </div>
        );
      case 'revenue':
        return (
          <div className="dashboard">
            <h2>Распределение дохода</h2>
            <p>Функция распределения дохода будет добавлена в следующей версии</p>
            <button onClick={() => setCurrentView('dashboard')} className="btn">
              Вернуться к дашборду
            </button>
          </div>
        );
      case 'analytics':
        return (
          <div className="dashboard">
            <h2>Аналитика</h2>
            <p>Функция аналитики будет добавлена в следующей версии</p>
            <button onClick={() => setCurrentView('dashboard')} className="btn">
              Вернуться к дашборду
            </button>
          </div>
        );
      case 'assets':
        return <AssetList assets={assets} onLoadAssets={loadAssets} />;
      case 'transactions':
        return <TransactionHistory transactions={transactions} onLoadTransactions={loadTransactions} />;
      default:
        return (
          <div className="dashboard">
            <h2>Добро пожаловать в Asset Tokenization Platform</h2>
            <div className="dashboard-grid">
              <div className="dashboard-card" onClick={() => setCurrentView('create')}>
                <h3>Создать актив</h3>
                <p>Токенизируйте ваш актив на блокчейне Solana</p>
              </div>
              <div className="dashboard-card" onClick={() => setCurrentView('revenue')}>
                <h3>Распределить доход</h3>
                <p>Распределите доход между держателями токенов</p>
              </div>
              <div className="dashboard-card" onClick={() => setCurrentView('analytics')}>
                <h3>Аналитика</h3>
                <p>Просмотрите статистику вашего портфеля</p>
              </div>
              <div className="dashboard-card" onClick={() => setCurrentView('assets')}>
                <h3>Мои активы</h3>
                <p>Управляйте вашими токенизированными активами</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <ConnectionProvider endpoint={RPC_URL}>
      <WalletProvider wallets={wallets}>
        <WalletModalProvider>
          <div className="app">
            <header className="app-header">
              <div className="header-content">
                <h1>🚀 Asset Tokenization Platform</h1>
                <div className="header-controls">
                  <div className={`api-status ${apiStatus}`}>
                    {apiStatus === 'connected' && '✅ API подключен'}
                    {apiStatus === 'checking' && '🔄 Проверка API...'}
                    {apiStatus === 'error' && '❌ API недоступен'}
                  </div>
                  <WalletMultiButton />
                </div>
              </div>
            </header>

            <nav className="app-nav">
              <button 
                className={currentView === 'dashboard' ? 'active' : ''}
                onClick={() => setCurrentView('dashboard')}
              >
                🏠 Дашборд
              </button>
              <button 
                className={currentView === 'create' ? 'active' : ''}
                onClick={() => setCurrentView('create')}
              >
                ➕ Создать актив
              </button>
              <button 
                className={currentView === 'revenue' ? 'active' : ''}
                onClick={() => setCurrentView('revenue')}
              >
                💰 Распределить доход
              </button>
              <button 
                className={currentView === 'analytics' ? 'active' : ''}
                onClick={() => setCurrentView('analytics')}
              >
                📊 Аналитика
              </button>
              <button 
                className={currentView === 'assets' ? 'active' : ''}
                onClick={() => setCurrentView('assets')}
              >
                📋 Мои активы
              </button>
              <button 
                className={currentView === 'transactions' ? 'active' : ''}
                onClick={() => setCurrentView('transactions')}
              >
                📜 Транзакции
              </button>
            </nav>

            <main className="app-main">
              {renderView()}
            </main>

            <footer className="app-footer">
              <p>Asset Tokenization Platform - Powered by Solana Blockchain</p>
              <p>Network: {NETWORK} | API: {API_BASE_URL}</p>
            </footer>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
