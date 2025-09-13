// FRONTEND: Компонент покупки фракций
// ===================================

import React, { useState } from 'react';
import { validateAmount, handleApiError } from '../utils/utils';
import { API_ENDPOINTS } from '../config/config';

function BuyFractionsForm({ assetId, wallet, onFractionsBought }) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);
    setError(''); // Очищаем ошибку при изменении
  };

  const validateForm = () => {
    if (!validateAmount(amount)) {
      setError('Введите корректное количество фракций');
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
      const response = await fetch(
        API_ENDPOINTS.BASE_URL + API_ENDPOINTS.BUY.replace(':id', assetId), 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: parseInt(amount),
            buyer: wallet.publicKey.toString()
          })
        }
      );
      
      const result = await response.json();
      
      if (result.success) {
        setAmount(''); // Сброс формы
        
        // Уведомление родительского компонента
        if (onFractionsBought) {
          onFractionsBought(result);
        }
        
        alert(`Успешно куплено ${amount} фракций!`);
      } else {
        setError(result.error || 'Ошибка покупки фракций');
      }
    } catch (error) {
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="buy-fractions-form">
      <h3>Купить фракции</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="amount">Количество фракций:</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={amount}
            onChange={handleAmountChange}
            min="1"
            placeholder="100"
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
          {loading ? 'Покупка...' : 'Купить фракции'}
        </button>
      </form>
    </div>
  );
}

export default BuyFractionsForm;
