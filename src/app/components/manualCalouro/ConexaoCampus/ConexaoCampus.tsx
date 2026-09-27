import React from 'react';
import styles from './ConexaoCampus.module.css';

interface ConexaoCampusProps {
  onSelectWifi?: () => void;
  onSelectEmail?: () => void;
}

export const ConexaoCampus: React.FC<ConexaoCampusProps> = ({ onSelectWifi, onSelectEmail }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.mainCardWrapper}>
        
        {/* Título com linha decorativa centralizado */}
        <div className={styles.titleWrapper}>
          <h2 className={styles.mainTitle}>Conexão no Campus</h2>
          <div className={styles.titleLine} />
        </div>

        {/* Grid com os dois cards de destino/opções */}
        <div className={styles.cardsGrid}>
          
          {/* Card 1: Conexão Wi-Fi */}
          <div className={styles.optionCard} onClick={onSelectWifi}>
            <div className={styles.cardIconWifi}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
                <path d="M1.42 9a16 16 0 0 1 21.16 0"></path>
                <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
                <line x1="12" y1="20" x2="12.01" y2="20"></line>
              </svg>
            </div>
            <div className={styles.cardContent}>
              <h3>Conexão Wi-Fi</h3>
              <p>Abrir guia de acesso à rede</p>
            </div>
            <div className={styles.arrowWrapper}>
              <span>&rsaquo;</span>
            </div>
          </div>

          {/* Card 2: E-mail Institucional */}
          <div className={styles.optionCard} onClick={onSelectEmail}>
            <div className={styles.cardIconEmail}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
            <div className={styles.cardContent}>
              <h3>E-mail institucional</h3>
              <p>Abrir guia para solicitar/criar o e-mail</p>
            </div>
            <div className={styles.arrowWrapper}>
              <span>&rsaquo;</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};