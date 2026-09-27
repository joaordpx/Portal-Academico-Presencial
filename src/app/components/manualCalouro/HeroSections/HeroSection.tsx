import React, { useEffect, useRef, useState } from 'react';
import styles from './HeroSection.module.css';
import { getHeroImage } from '../../../services/heroService';

interface HeroSectionProps {
  imageSrc?: string;
  onSelectWifi?: () => void;
  onSelectEmail?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  imageSrc = '/university-colleagues-talking-library.jpg',
  onSelectWifi,
  onSelectEmail,
}) => {
  const sectionRef = useRef<HTMLElement>(null);

  const [isVisible, setIsVisible] = useState(false);

  // Imagem padrão enquanto o backend não possui uma imagem cadastrada
  const [heroImage, setHeroImage] = useState(imageSrc);

  const [heroAlt, setHeroAlt] = useState(
    'Estudantes iniciando sua jornada universitária na Unimontes'
  );

  /*
   * Carrega a imagem do Hero cadastrada no backend.
   */
  useEffect(() => {
    const carregarHero = async () => {
      try {
        const response = await getHeroImage();

        if (response.hero) {
          setHeroImage(response.hero.imagem);
          setHeroAlt(response.hero.alt);
        }
      } catch (error) {
        console.error(
          'Erro ao carregar imagem do Hero:',
          error
        );

        // Se a API falhar, mantém a imagem padrão.
        setHeroImage(imageSrc);
      }
    };

    carregarHero();
  }, [imageSrc]);

  /*
   * Animação de entrada do Hero.
   */
  useEffect(() => {
    const node = sectionRef.current;

    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.15,
      }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`${styles.heroWrapper} ${
        isVisible ? styles.isVisible : ''
      }`}
      aria-label="Apresentação do Manual do Calouro"
    >
      {/* Elementos decorativos */}
      <div className={styles.backgroundShape} />
      <div className={styles.backgroundCircle} />

      <div className={styles.heroContent}>
        {/* =========================
            COLUNA DE TEXTO
        ========================== */}
        <div className={styles.textColumn}>
          <div className={styles.categoryHeader}>
            <span className={styles.categoryLine} />

            <span className={styles.categoryText}>
              BEM-VINDO À UNIMONTES
            </span>
          </div>

          <div className={styles.manualBadge}>
            <span className={styles.badgeIcon}>
              🎓
            </span>

            Manual do Calouro
          </div>

          <h1 className={styles.editorialTitle}>
            Calma, <span>calouro.</span>
            <br />

            A gente te ajuda a
            <br />

            <em>não se perder</em>
            <br />

            por aqui.
          </h1>

          <p className={styles.editorialDescription}>
            Universidade nova, sistemas, documentos, acessos e muitas
            informações para entender. Reunimos o que realmente importa para
            ajudar você a começar sua jornada na Unimontes com mais segurança e
            menos complicação.
          </p>
        </div>

        {/* =========================
            COLUNA DA IMAGEM
        ========================== */}
        <div className={styles.imageColumn}>
          <div className={styles.imageContainerWrapper}>

            {/* Logo discreta da Unimontes */}
            <div
              className={styles.unimontesLogoBackground}
              aria-hidden="true"
            >
              <img
                src="/logo-unimontes.svg"
                alt=""
              />
            </div>

            {/* Moldura amarela */}
            <div className={styles.yellowBackdropFrame} />

            {/* Imagem */}
            <div className={styles.imageFrame}>
              <div className={styles.matriculasBadge}>
                <span className={styles.badgeDot} />

                Comece por aqui
              </div>

              <img
                src={heroImage}
                alt={heroAlt}
                className={styles.heroImage}
                loading="eager"
              />

              {/* Gradiente inferior */}
              <div className={styles.imageOverlay} />

              {/* Informação na parte inferior */}
              <div className={styles.imageInfo}>
                <div className={styles.imageInfoIcon}>
                  ✦
                </div>

                <div className={styles.imageInfoText}>
                  <strong>
                    Uma nova fase começa agora.
                  </strong>

                  <span>
                    Você não precisa descobrir tudo sozinho.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;