import React from 'react';
import styles from './HeroBanner.module.css';

interface HeroBannerProps {
  category?: string;
  title?: string;
  description?: string;
  logoSrc?: string;
  logoAlt?: string;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  category = "MANUAL DO CALOURO",
  title = "MANUAL DO CALOURO.",
  description,
  // CORREÇÃO: Removemos o "/public". O navegador busca direto na raiz do projeto.
  logoSrc = "/figurativa-unimontes.svg", 
  logoAlt = "Logotipo da Unimontes",
}) => {
  return (
    <div className={styles.heroWrapper}>
      {/* Header Institucional Integrado */}
      <header className={styles.topHeader}>
        <div className={styles.logoArea}>
          {/* Imagem do Logotipo */}
          <div >
            <img 
              src={logoSrc} 
              alt={logoAlt} 
              className={styles.unimontesLogoImg} 
            />
          </div>

          <div className={styles.logoText}>
            <strong>Unimontes</strong>
            <span>Universidade Estadual de Montes Claros</span>
          </div>
        </div>

        <nav className={styles.mainNav}>
          <a href="#portal" className={styles.activeLink}>Portal acadêmico</a>
          <a href="#sobre">Sobre a Unimontes</a>
          <a href="#mapa">Mapa da Unimontes</a>
          <a href="#ajuda">Ajuda</a>
        </nav>
      </header>

      {/* Conteúdo do Hero */}
      <div className={styles.heroBody}>
        <div className={styles.leftCol}>
          <span className={styles.badge}>{category}</span>
          <h1 className={styles.title}>{title}</h1>

          <div className={styles.textContent}>
            {description ? (
              <p>{description}</p>
            ) : (
              <>
                <p>
                  Bem-vindo à Universidade Estadual de Montes Claros. Você é peça importante da nossa instituição de ensino do Norte de Minas e do Brasil.
                </p>
                <p>
                  Você acaba de ingressar em uma universidade pública, gratuita e reconhecida como uma das melhores do Brasil. Para aproveitar ao máximo sua experiência, reunimos as informações essenciais para você embarcar com el pé direito.
                </p>
              </>
            )}
          </div>

          <div className={styles.divider} />

          {/* Atalhos Rápidos */}
          <div className={styles.conexionArea}>
            <span className={styles.conexionLabel}>CONEXÃO NO CAMPUS</span>
            <div className={styles.conexionItems}>
              <a href="#wifi" className={styles.conexionItem}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.iconSvg}>
                  <path d="M5 12.55a11 11 0 0 1 14 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/>
                </svg>
                <span>Conexão Wi-Fi</span>
              </a>

              <a href="#email" className={styles.conexionItem}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.iconSvg}>
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
                <span>Email acadêmico</span>
              </a>
            </div>
          </div>
        </div>

        <div className={styles.rightCol}>
          <div className={styles.imageCard}>
            <img 
              src="/images/estudantes-unimontes.png" 
              alt="Estudantes Unimontes" 
              className={styles.heroImg} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};