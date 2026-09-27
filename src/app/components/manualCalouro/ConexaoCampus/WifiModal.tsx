import React from 'react';
import styles from './WifiModal.module.css';

interface WifiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WifiModal: React.FC<WifiModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        
        {/* Cabeçalho */}
        <div className={styles.modalHeader}>
          <h2 className={styles.headerTitle}>Como acessar o Wi-Fi</h2>
          <p className={styles.headerSubtitle}>Siga as orientações oficiais para conectar seus dispositivos.</p>
          
          <button className={styles.closeButton} onClick={onClose} aria-label="Fechar modal">
            &times;
          </button>
        </div>

        {/* Corpo Espaçado e Equilibrado */}
        <div className={styles.modalBody}>
          <div className={styles.sectionCategory}>PASSO A PASSO</div>

          <div className={styles.stepsWrapper}>
            
            {/* Passo 1 */}
            <div className={styles.stepItem}>
              <div className={styles.stepNumberWrapper}>
                <span className={styles.stepNumber}>1</span>
              </div>
              <div className={styles.stepContent}>
                <strong>Ative o Wi-Fi</strong>
                <p>Abra as configurações de rede do seu dispositivo.</p>
              </div>
            </div>

            {/* Passo 2 */}
            <div className={styles.stepItem}>
              <div className={styles.stepNumberWrapper}>
                <span className={styles.stepNumber}>2</span>
              </div>
              <div className={styles.stepContent}>
                <strong>Selecione a rede institucional</strong>
                <p>Conecte-se à rede oficial disponibilizada no campus.</p>
              </div>
            </div>

            {/* Passo 3 */}
            <div className={styles.stepItem}>
              <div className={styles.stepNumberWrapper}>
                <span className={styles.stepNumber}>3</span>
              </div>
              <div className={styles.stepContent}>
                <strong>Informe seu login</strong>
                
                {/* Box em azul claro interativo */}
                <div className={styles.inputCardUnimontesInteractive}>
                  <div className={styles.inputIconBox}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  </div>
                  <div className={styles.inputFieldInfo}>
                    <span className={styles.inputLabelName}>LOGIN</span>
                    <span className={styles.inputValueText}>Número de matrícula</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Passo 4 */}
            <div className={styles.stepItem}>
              <div className={styles.stepNumberWrapper}>
                <span className={styles.stepNumber}>4</span>
              </div>
              <div className={styles.stepContent}>
                <strong>Informe a senha inicial</strong>
                
                {/* Box em azul claro interativo */}
                <div className={styles.inputCardUnimontesInteractive}>
                  <div className={styles.inputIconBox}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  </div>
                  <div className={styles.inputFieldInfo}>
                    <span className={styles.inputLabelName}>SENHA INICIAL</span>
                    <span className={styles.inputValueText}>6 primeiros dígitos do CPF</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Passo 5 */}
            <div className={styles.stepItem}>
              <div className={styles.stepNumberWrapper}>
                <span className={styles.stepNumber}>5</span>
              </div>
              <div className={styles.stepContent}>
                <strong>Conecte-se com segurança</strong>
                <p>Confirme as credenciais inseridas e conclua.</p>
              </div>
            </div>

          </div>

          {/* Nota Institucional */}
          <div className={styles.notaInstitucional}>
            <div className={styles.notaIcon}>ℹ️</div>
            <div>
              <strong>Nota:</strong> Nunca compartilhe sua senha acadêmica com terceiros.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default WifiModal;