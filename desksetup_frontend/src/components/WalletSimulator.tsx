import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import styles from './WalletSimulator.module.css';

interface WalletData {
  saldo: number;
  historial: Array<{
    id: string;
    tipo: 'deposito' | 'compra' | 'retiro';
    monto: number;
    descripcion: string;
    fecha: string;
  }>;
}

const WalletSimulator: React.FC = () => {
  const [walletData, setWalletData] = useState<WalletData>({
    saldo: 100,
    historial: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [amountToAdd, setAmountToAdd] = useState<number>(0);

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      const currentUser = authService.getUser();
      if (!currentUser) {
        setError('Usuario no autenticado');
        setIsLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:3000/api/clientes/${currentUser._id}/wallet`);
      if (!response.ok) {
        throw new Error('Error al cargar datos de wallet');
      }

      const data = await response.json();
      setWalletData(data);
    } catch (error: any) {
      setError(error.message || 'Error al cargar wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMoney = async () => {
    if (amountToAdd <= 0) {
      setError('El monto debe ser mayor a 0');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const currentUser = authService.getUser();
      if (!currentUser) {
        throw new Error('Usuario no autenticado');
      }

      const response = await fetch(`http://localhost:3000/api/clientes/${currentUser._id}/wallet/deposito`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ monto: amountToAdd })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al agregar dinero');
      }

      const updatedWallet = await response.json();
      setWalletData(updatedWallet);
      setSuccess(`Se agregaron $${amountToAdd} a tu wallet`);
      setAmountToAdd(0);
      setShowAddMoney(false);
    } catch (error: any) {
      setError(error.message || 'Error al agregar dinero');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingText}>
          Cargando wallet...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Mi Wallet</h2>
        <button 
          onClick={() => setShowAddMoney(true)}
          className={styles.addMoneyButton}
        >
          + Agregar Dinero
        </button>
      </div>

      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}

      {success && (
        <div className={styles.successMessage}>
          {success}
        </div>
      )}

      <div className={styles.walletCard}>
        <div className={styles.balanceSection}>
          <h3 className={styles.balanceTitle}>Saldo Actual</h3>
          <div className={styles.balanceAmount}>
            ${walletData.saldo.toFixed(2)} USD
          </div>
        </div>

        <div className={styles.statsSection}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Total de Transacciones</span>
            <span className={styles.statValue}>{walletData.historial.length}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Última Transacción</span>
            <span className={styles.statValue}>
              {walletData.historial.length > 0 
                ? formatDate(walletData.historial[0].fecha)
                : 'N/A'
              }
            </span>
          </div>
        </div>
      </div>

      <div className={styles.historySection}>
        <h3 className={styles.historyTitle}>Historial de Transacciones</h3>
        
        {walletData.historial.length === 0 ? (
          <div className={styles.emptyHistory}>
            <div className={styles.emptyIcon}>💰</div>
            <p>No hay transacciones aún</p>
            <p>¡Agrega dinero para empezar!</p>
          </div>
        ) : (
          <div className={styles.transactionList}>
            {walletData.historial.map((transaction) => (
              <div key={transaction.id} className={styles.transactionItem}>
                <div className={styles.transactionInfo}>
                  <span className={styles.transactionType}>
                    {transaction.tipo === 'deposito' ? '💰 Depósito' :
                     transaction.tipo === 'compra' ? '🛒 Compra' :
                     '💸 Retiro'}
                  </span>
                  <span className={styles.transactionDescription}>
                    {transaction.descripcion}
                  </span>
                  <span className={styles.transactionDate}>
                    {formatDate(transaction.fecha)}
                  </span>
                </div>
                <div className={`${styles.transactionAmount} ${
                  transaction.tipo === 'deposito' ? styles.positive : styles.negative
                }`}>
                  {transaction.tipo === 'deposito' ? '+' : '-'}${transaction.monto.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal para agregar dinero */}
      {showAddMoney && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Agregar Dinero</h3>
            <div className={styles.formGroup}>
              <label htmlFor="amount">Monto a agregar ($)</label>
              <input
                type="number"
                id="amount"
                value={amountToAdd}
                onChange={(e) => setAmountToAdd(Number(e.target.value))}
                min="1"
                step="0.01"
                placeholder="0.00"
                className={styles.amountInput}
              />
            </div>
            <div className={styles.modalActions}>
              <button
                onClick={() => {
                  setShowAddMoney(false);
                  setAmountToAdd(0);
                }}
                className={styles.cancelButton}
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                onClick={handleAddMoney}
                className={styles.confirmButton}
                disabled={isLoading || amountToAdd <= 0}
              >
                {isLoading ? 'Procesando...' : 'Agregar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletSimulator;