import React from 'react';
import styles from './Footer.module.css';

const Footer: React.FC = () => (
  <footer className={styles['footer-futuristic']}>
    <div className={`container ${styles['footer-container']}`}>
      <span>© 2025 DeskSetup Pro. Todos los derechos reservados.</span>
      <div className={styles['footer-social']}>
        <a href="#" className={styles['footer-link']} aria-label="Twitter">
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path fill="#4ad1ff" d="M22 5.924a8.4 8.4 0 0 1-2.357.646A4.13 4.13 0 0 0 21.448 4.1a8.224 8.224 0 0 1-2.605.996A4.107 4.107 0 0 0 11.034 9.03a11.65 11.65 0 0 1-8.457-4.287a4.106 4.106 0 0 0 1.27 5.482A4.073 4.073 0 0 1 2 9.097v.052a4.106 4.106 0 0 0 3.292 4.025a4.093 4.093 0 0 1-1.852.07a4.108 4.108 0 0 0 3.834 2.85A8.233 8.233 0 0 1 2 19.13a11.616 11.616 0 0 0 6.29 1.844c7.547 0 11.675-6.155 11.675-11.495c0-.175-.004-.35-.012-.523A8.18 8.18 0 0 0 22 5.924Z"/></svg>
        </a>
        <a href="#" className={styles['footer-link']} aria-label="Instagram">
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="5" fill="#4ad1ff"/><circle cx="12" cy="12" r="4.5" fill="#181a2a"/><circle cx="17" cy="7" r="1.5" fill="#181a2a"/></svg>
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;