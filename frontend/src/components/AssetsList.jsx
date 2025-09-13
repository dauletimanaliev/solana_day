// FRONTEND: Компонент списка активов
// ==================================

import React, { useState, useEffect } from 'react';
import { formatAddress, formatAmount, formatDate, calculateOwnershipPercentage } from '../utils/utils';
import BuyFractionsForm from './BuyFractionsForm';

function AssetsList({ wallet }) {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/assets');
      const data = await response.json();
      
      if (data.success) {
        setAssets(data.assets || []);
      } else {
        setError(data.error || 'Ошибка загрузки активов');
      }
    } catch (error) {
      setError('Ошибка сети при загрузке активов');
    } finally {
      setLoading(false);
    }
  };

  const handleAssetCreated = (newAsset) => {
    // Обновляем список активов
    fetchAssets();
  };

  const handleFractionsBought = (result) => {
    // Обновляем список активов
    fetchAssets();
  };

  if (loading) {
    return (
      <div className="assets-list">
        <h2>Список активов</h2>
        <div className="loading">Загрузка...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="assets-list">
        <h2>Список активов</h2>
        <div className="error-message">{error}</div>
        <button onClick={fetchAssets} className="btn-secondary">
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className="assets-list">
      <h2>Список активов</h2>
      
      {assets.length === 0 ? (
        <div className="no-assets">
          <p>Активы не найдены</p>
        </div>
      ) : (
        <div className="assets-grid">
          {assets.map((asset) => (
            <div key={asset.id} className="asset-card">
              <div className="asset-header">
                <h3>Asset #{asset.asset_id}</h3>
                <span className="asset-status">Активен</span>
              </div>
              
              <div className="asset-info">
                <div className="info-row">
                  <span className="label">Создатель:</span>
                  <span className="value">{formatAddress(asset.creator_address)}</span>
                </div>
                
                <div className="info-row">
                  <span className="label">Общее количество:</span>
                  <span className="value">{formatAmount(asset.total_supply)}</span>
                </div>
                
                <div className="info-row">
                  <span className="label">PDA адрес:</span>
                  <span className="value">{formatAddress(asset.pda_address)}</span>
                </div>
                
                <div className="info-row">
                  <span className="label">Создан:</span>
                  <span className="value">{formatDate(asset.created_at)}</span>
                </div>
                
                <div className="info-row">
                  <span className="label">Метаданные:</span>
                  <a 
                    href={asset.metadata_uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="metadata-link"
                  >
                    Посмотреть
                  </a>
                </div>
              </div>
              
              <div className="asset-actions">
                <BuyFractionsForm 
                  assetId={asset.asset_id}
                  wallet={wallet}
                  onFractionsBought={handleFractionsBought}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AssetsList;
