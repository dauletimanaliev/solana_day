// FRONTEND: Компонент создания актива
// ===================================

import React, { useState } from 'react';
import { generateAssetId, validateAssetId, validateAmount, handleApiError } from '../utils/utils';
import { API_ENDPOINTS, UI_CONSTANTS } from '../config/config';

function CreateAssetForm({ wallet, onAssetCreated }) {
  const [formData, setFormData] = useState({
    assetId: generateAssetId().toString(),
    metadataUri: '',
    totalSupply: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Очищаем ошибку при изменении
  };

  const validateForm = () => {
    if (!validateAssetId(formData.assetId)) {
      setError('Неверный Asset ID (1-999999)');
      return false;
    }
    
    if (!formData.metadataUri.trim()) {
      setError('Введите URI метаданных');
      return false;
    }
    
    if (!validateAmount(formData.totalSupply)) {
      setError('Введите корректное количество токенов');
      return false;
    }
    
    const totalSupply = parseInt(formData.totalSupply);
    if (totalSupply < UI_CONSTANTS.MIN_TOTAL_SUPPLY || totalSupply > UI_CONSTANTS.MAX_TOTAL_SUPPLY) {
      setError(`Количество токенов должно быть от ${UI_CONSTANTS.MIN_TOTAL_SUPPLY} до ${UI_CONSTANTS.MAX_TOTAL_SUPPLY}`);
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!wallet?.publicKey) {
      setError('Подключите кошелек');
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(API_ENDPOINTS.BASE_URL + API_ENDPOINTS.ASSETS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assetId: parseInt(formData.assetId),
          metadataUri: formData.metadataUri.trim(),
          totalSupply: parseInt(formData.totalSupply),
          creator: wallet.publicKey.toString()
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Сброс формы
        setFormData({
          assetId: generateAssetId().toString(),
          metadataUri: '',
          totalSupply: ''
        });
        
        // Уведомление родительского компонента
        if (onAssetCreated) {
          onAssetCreated(result);
        }
        
        alert('Актив успешно создан!');
      } else {
        setError(result.error || 'Ошибка создания актива');
      }
    } catch (error) {
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const generateNewAssetId = () => {
    setFormData(prev => ({
      ...prev,
      assetId: generateAssetId().toString()
    }));
  };

  return (
    <div className="create-asset-form">
      <h2>Создание нового актива</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="assetId">Asset ID:</label>
          <div className="input-group">
            <input
              type="number"
              id="assetId"
              name="assetId"
              value={formData.assetId}
              onChange={handleInputChange}
              min="1"
              max="999999"
              required
            />
            <button 
              type="button" 
              onClick={generateNewAssetId}
              className="btn-secondary"
            >
              Сгенерировать
            </button>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="metadataUri">URI метаданных:</label>
          <input
            type="url"
            id="metadataUri"
            name="metadataUri"
            value={formData.metadataUri}
            onChange={handleInputChange}
            placeholder="https://example.com/metadata.json"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="totalSupply">Общее количество токенов:</label>
          <input
            type="number"
            id="totalSupply"
            name="totalSupply"
            value={formData.totalSupply}
            onChange={handleInputChange}
            min={UI_CONSTANTS.MIN_TOTAL_SUPPLY}
            max={UI_CONSTANTS.MAX_TOTAL_SUPPLY}
            placeholder="1000000"
            required
          />
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading}
          className="btn-primary"
        >
          {loading ? 'Создание...' : 'Создать актив'}
        </button>
      </form>
    </div>
  );
}

export default CreateAssetForm;
