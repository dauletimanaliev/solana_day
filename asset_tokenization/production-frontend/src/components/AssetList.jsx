// ПРОДАКШЕН КОМПОНЕНТ: Список активов
// ===================================

import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

const AssetList = ({ assets, onLoadAssets }) => {
  const { publicKey, connected } = useWallet();
  const [loading, setLoading] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);

  useEffect(() => {
    if (onLoadAssets) {
      onLoadAssets();
    }
  }, [onLoadAssets]);

  const handleBuyFractions = async (assetId, amount) => {
    if (!connected) {
      alert('Подключите кошелек для покупки фракций');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/transactions/buy_fraction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assetId: parseInt(assetId),
          amount: parseInt(amount),
          buyer: publicKey.toString()
        })
      });

      const result = await response.json();
      
      if (result.success) {
        alert(`Фракции куплены! Транзакция: ${result.data.transaction}`);
        console.log('Explorer:', result.data.explorer);
      } else {
        alert(`Ошибка: ${result.error}`);
      }
    } catch (error) {
      console.error('Ошибка покупки фракций:', error);
      alert('Ошибка при покупке фракций');
    } finally {
      setLoading(false);
    }
  };

  const handleMintTokens = async (assetId, amount) => {
    if (!connected) {
      alert('Подключите кошелек для минтинга токенов');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/assets/mint_fraction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assetId: parseInt(assetId),
          amount: parseInt(amount),
          creator: publicKey.toString()
        })
      });

      const result = await response.json();
      
      if (result.success) {
        alert(`Токены заминчены! Транзакция: ${result.data.transaction}`);
        console.log('Explorer:', result.data.explorer);
      } else {
        alert(`Ошибка: ${result.error}`);
      }
    } catch (error) {
      console.error('Ошибка минтинга токенов:', error);
      alert('Ошибка при минтинге токенов');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="asset-list">
      <div className="asset-list-header">
        <h2>📋 Мои активы</h2>
        <button 
          className="refresh-button"
          onClick={onLoadAssets}
          disabled={loading}
        >
          {loading ? '🔄' : '🔄'} Обновить
        </button>
      </div>

      {!connected && (
        <div className="warning-message">
          ⚠️ Подключите кошелек для просмотра и управления активами
        </div>
      )}

      {assets.length === 0 ? (
        <div className="empty-state">
          <h3>Нет активов</h3>
          <p>Создайте свой первый токенизированный актив</p>
        </div>
      ) : (
        <div className="assets-grid">
          {assets.map((asset) => (
            <div key={asset.id} className="asset-card">
              <div className="asset-header">
                <h3>{asset.name || `Актив ${asset.id}`}</h3>
                <span className="asset-id">ID: {asset.id}</span>
              </div>
              
              <div className="asset-info">
                <div className="info-row">
                  <span>Создатель:</span>
                  <span className="address">{asset.creator}</span>
                </div>
                <div className="info-row">
                  <span>Общее количество:</span>
                  <span>{parseInt(asset.totalSupply).toLocaleString()}</span>
                </div>
                <div className="info-row">
                  <span>Остаток:</span>
                  <span>{parseInt(asset.remainingSupply).toLocaleString()}</span>
                </div>
                <div className="info-row">
                  <span>Метаданные:</span>
                  <a href={asset.metadataUri} target="_blank" rel="noopener noreferrer">
                    Просмотреть
                  </a>
                </div>
              </div>

              <div className="asset-actions">
                <button
                  className="action-button primary"
                  onClick={() => setSelectedAsset(asset)}
                >
                  📊 Детали
                </button>
                
                {connected && (
                  <>
                    <button
                      className="action-button secondary"
                      onClick={() => {
                        const amount = prompt('Количество токенов для минтинга:');
                        if (amount) handleMintTokens(asset.id, amount);
                      }}
                      disabled={loading}
                    >
                      🪙 Минтить
                    </button>
                    
                    <button
                      className="action-button success"
                      onClick={() => {
                        const amount = prompt('Количество фракций для покупки:');
                        if (amount) handleBuyFractions(asset.id, amount);
                      }}
                      disabled={loading}
                    >
                      💰 Купить
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedAsset && (
        <div className="modal-overlay" onClick={() => setSelectedAsset(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Детали актива {selectedAsset.id}</h3>
              <button 
                className="close-button"
                onClick={() => setSelectedAsset(null)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-item">
                  <label>ID актива:</label>
                  <span>{selectedAsset.id}</span>
                </div>
                <div className="detail-item">
                  <label>Создатель:</label>
                  <span className="address">{selectedAsset.creator}</span>
                </div>
                <div className="detail-item">
                  <label>Общее количество:</label>
                  <span>{parseInt(selectedAsset.totalSupply).toLocaleString()}</span>
                </div>
                <div className="detail-item">
                  <label>Остаток:</label>
                  <span>{parseInt(selectedAsset.remainingSupply).toLocaleString()}</span>
                </div>
                <div className="detail-item">
                  <label>Метаданные:</label>
                  <a href={selectedAsset.metadataUri} target="_blank" rel="noopener noreferrer">
                    {selectedAsset.metadataUri}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetList;
