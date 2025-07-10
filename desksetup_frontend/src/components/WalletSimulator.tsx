import React, { useState, useEffect } from 'react';
import styles from './WalletSimulator.module.css';

const WALLET_KEY = 'wallet_connected';

const WalletSimulator: React.FC = () => {
  const [connected, setConnected] = useState<boolean>(false);
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    const saved = localStorage.getItem(WALLET_KEY);
    if (saved === 'true') {
      setConnected(true);
      setBalance(Math.random() * 1000 + 100); // Balance aleatorio entre 100-1100
    }
  }, []);

  const handleConnect = () => {
    setConnected(true);
    setBalance(Math.random() * 1000 + 100);
    localStorage.setItem(WALLET_KEY, 'true');
  };

  const handleDisconnect = () => {
    setConnected(false);
    setBalance(0);
    localStorage.removeItem(WALLET_KEY);
  };

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>
        Wallet Digital
      </h2>

      {connected ? (
        <div className={styles.connectedCard}>
          <div className={styles.connectedStatus}>
            <span className={styles.connectedText}>
              Wallet conectada ✓
            </span>
          </div>
          
          <div className={styles.balanceContainer}>
            <div className={styles.balanceLabel}>
              Balance Disponible
            </div>
            <div className={styles.balanceAmount}>
              ${balance.toFixed(2)} USD
            </div>
          </div>

          <div className={styles.connectedActions}>
            <button 
              onClick={() => alert('Función de envío de fondos en desarrollo')}
              className={styles.sendButton}
            >
              Enviar Fondos
            </button>
            
            <button 
              onClick={() => alert('Función de recibir fondos en desarrollo')}
              className={styles.receiveButton}
            >
              Recibir Fondos
            </button>
            
            <button 
              onClick={handleDisconnect}
              className={styles.disconnectButton}
            >
              Desconectar
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.disconnectedCard}>
          <div className={styles.disconnectedStatus}>
            <span className={styles.disconnectedText}>
              Wallet no conectada
            </span>
          </div>
          
          <p className={styles.description}>
            Conecta tu wallet para realizar transacciones y gestionar tus fondos digitales.
          </p>
          
          <button 
            onClick={handleConnect} 
            className={styles.connectButton}
          >
            Conectar Wallet
          </button>
        </div>
      )}
    </section>
  );
};

export default WalletSimulator;