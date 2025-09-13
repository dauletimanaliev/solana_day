// ПРОДАКШЕН КОМПОНЕНТ: История транзакций
// =======================================

import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

const TransactionHistory = ({ transactions, onLoadTransactions }) => {
  const { publicKey, connected } = useWallet();
  const [loading, setLoading] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [transactionDetails, setTransactionDetails] = useState(null);

  useEffect(() => {
    if (onLoadTransactions) {
      onLoadTransactions();
    }
  }, [onLoadTransactions]);

  const loadTransactionDetails = async (transactionId) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/transactions/${transactionId}`);
      const result = await response.json();
      
      if (result.success) {
        setTransactionDetails(result.data);
      } else {
        alert(`Ошибка загрузки транзакции: ${result.error}`);
      }
    } catch (error) {
      console.error('Ошибка загрузки деталей транзакции:', error);
      alert('Ошибка при загрузке деталей транзакции');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const formatAmount = (amount) => {
    return (amount / 1e9).toFixed(4) + ' SOL';
  };

  return (
    <div className="transaction-history">
      <div className="transaction-header">
        <h2>📜 История транзакций</h2>
        <button 
          className="refresh-button"
          onClick={onLoadTransactions}
          disabled={loading}
        >
          {loading ? '🔄' : '🔄'} Обновить
        </button>
      </div>

      {!connected && (
        <div className="warning-message">
          ⚠️ Подключите кошелек для просмотра транзакций
        </div>
      )}

      {transactions.length === 0 ? (
        <div className="empty-state">
          <h3>Нет транзакций</h3>
          <p>Ваши транзакции появятся здесь после создания активов</p>
        </div>
      ) : (
        <div className="transactions-list">
          {transactions.map((tx, index) => (
            <div key={index} className="transaction-card">
              <div className="transaction-info">
                <div className="transaction-id">
                  <span className="label">ID:</span>
                  <span className="value">{tx.id}</span>
                </div>
                <div className="transaction-type">
                  <span className="label">Тип:</span>
                  <span className={`type ${tx.type}`}>{tx.type}</span>
                </div>
                <div className="transaction-amount">
                  <span className="label">Сумма:</span>
                  <span className="value">{tx.amount}</span>
                </div>
                <div className="transaction-date">
                  <span className="label">Дата:</span>
                  <span className="value">{formatDate(tx.timestamp)}</span>
                </div>
                <div className="transaction-status">
                  <span className="label">Статус:</span>
                  <span className={`status ${tx.status}`}>{tx.status}</span>
                </div>
              </div>
              
              <div className="transaction-actions">
                <button
                  className="action-button"
                  onClick={() => {
                    setSelectedTransaction(tx);
                    loadTransactionDetails(tx.id);
                  }}
                  disabled={loading}
                >
                  📊 Детали
                </button>
                
                <button
                  className="action-button"
                  onClick={() => window.open(tx.explorer, '_blank')}
                >
                  🔗 Explorer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedTransaction && (
        <div className="modal-overlay" onClick={() => setSelectedTransaction(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Детали транзакции</h3>
              <button 
                className="close-button"
                onClick={() => setSelectedTransaction(null)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              {loading ? (
                <div className="loading">Загрузка деталей...</div>
              ) : transactionDetails ? (
                <div className="transaction-details">
                  <div className="detail-item">
                    <label>ID транзакции:</label>
                    <span className="address">{transactionDetails.transactionId}</span>
                  </div>
                  <div className="detail-item">
                    <label>Слот:</label>
                    <span>{transactionDetails.slot}</span>
                  </div>
                  <div className="detail-item">
                    <label>Время блока:</label>
                    <span>{formatDate(transactionDetails.blockTime)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Комиссия:</label>
                    <span>{formatAmount(transactionDetails.fee)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Статус:</label>
                    <span className={`status ${transactionDetails.status}`}>
                      {transactionDetails.status}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Explorer:</label>
                    <a 
                      href={transactionDetails.explorer} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Открыть в Explorer
                    </a>
                  </div>
                  
                  {transactionDetails.logs && transactionDetails.logs.length > 0 && (
                    <div className="logs-section">
                      <h4>Логи транзакции:</h4>
                      <div className="logs">
                        {transactionDetails.logs.map((log, index) => (
                          <div key={index} className="log-entry">
                            {log}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="error">Ошибка загрузки деталей транзакции</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
