import React, { useEffect } from 'react';
import styles from './Notification.module.css';

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'info';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const Notification: React.FC<NotificationProps> = ({ 
  message, 
  type, 
  isVisible, 
  onClose, 
  duration = 3000 
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className={`${styles.notification} ${styles[type]} ${styles.show}`}>
      <div className={styles.content}>
        <div className={styles.icon}>
          {type === 'success' && '✓'}
          {type === 'error' && '✗'}
          {type === 'info' && 'ℹ'}
        </div>
        <span className={styles.message}>{message}</span>
      </div>
      <button onClick={onClose} className={styles.closeButton}>
        ×
      </button>
    </div>
  );
};

export default Notification; 