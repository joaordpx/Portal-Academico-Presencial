import React, { useState } from 'react';
import styles from './EmailModal.module.css';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmailModal: React.FC<EmailModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'text' | 'video'>('text');

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        
        {/* Cabeçalho Institucional */}
        <div className={styles.modalHeader}>
          <h2 className={styles.headerTitle}>E-mail institucional</h2>
          <p className={styles.headerSubtitle}>Ao clicar, o aluno escolhe como deseja receber a orientação.</p>
          
          <button className={styles.closeButton} onClick={onClose} aria-label="Fechar modal">
            &times;
          </button>
        </div>

        {/* Corpo com a estrutura exata da imagem */}
        <div className={styles.modalBody}>
          
          {/* Seletor de Opções (Passo a passo vs Vídeo) */}
          <div className={styles.optionsGrid}>
            
            {/* Opção 1: Ver passo a passo */}
            <div 
              className={`${styles.optionCard} ${activeTab === 'text' ? styles.optionCardActive : ''}`}
              onClick={() => setActiveTab('text')}
            >
              <div className={styles.optionIconBox}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
              </div>
              <div>
                <strong className={styles.optionTitle}>Ver passo a passo</strong>
                <p className={styles.optionDesc}>Orientações dentro do portal</p>
              </div>
            </div>

            {/* Opção 2: Assistir ao vídeo */}
            <div 
              className={`${styles.optionCard} ${activeTab === 'video' ? styles.optionCardActive : ''}`}
              onClick={() => setActiveTab('video')}
            >
              <div className={styles.optionIconBox}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              </div>
              <div>
                <strong className={styles.optionTitle}>Assistir ao vídeo</strong>
                <p className={styles.optionDesc}>Tutorial oficial no YouTube</p>
              </div>
            </div>

          </div>

          {/* Área Dinâmica baseada na escolha */}
          {activeTab === 'text' ? (
            <div className={styles.guiaTextualBox}>
              <div className={styles.sectionCategory}>GUIA TEXTUAL</div>
              
              <div className={styles.stepsList}>
                <div className={styles.stepRow}>
                  <span className={styles.stepNum}>1.</span>
                  <span>Acessar a página oficial para solicitação do e-mail institucional.</span>
                </div>
                <div className={styles.stepRow}>
                  <span className={styles.stepNum}>2.</span>
                  <span>Informar os dados solicitados pela Unimontes.</span>
                </div>
                <div className={styles.stepRow}>
                  <span className={styles.stepNum}>3.</span>
                  <span>Enviar a solicitação e acompanhar as orientações apresentadas.</span>
                </div>
                <div className={styles.stepRow}>
                  <span className={styles.stepNum}>4.</span>
                  <span>Após a criação, acessar o e-mail institucional e definir/confirmar a senha.</span>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.videoPlaceholderBox}>
              <div className={styles.videoIconWrapper}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              </div>
              <strong className={styles.videoTitle}>Vídeo Tutorial Disponível</strong>
              <p className={styles.videoDesc}>O tutorial em vídeo oficial da Unimontes será carregado aqui para auxiliar no seu primeiro acesso.</p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default EmailModal;