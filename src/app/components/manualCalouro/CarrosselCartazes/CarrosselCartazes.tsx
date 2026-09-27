// CarrosselCartazes.tsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import styles from './CarrosselCartazes.module.css';

interface Banner {
  id: string;
  imagem: string;
  alt: string;
  link?: string;
}

const bannersMock: Banner[] = [
  { id: '1', imagem: '/banner_concurso_unimontes_2026.jpg', alt: 'Aula Inaugural 2026' },
  { id: '2', imagem: '/banner_congresso_2026.jpeg', alt: 'Trilha do Calouro' },
  { id: '3', imagem: '/banner_legis_eleitoral_2026.jpg', alt: 'Feira de Centros Acadêmicos' },
];

const AUTO_ADVANCE_MS = 5000;
const SWIPE_THRESHOLD_PX = 50;
const TRANSITION_MS = 500;
const RESET_SAFETY_BUFFER_MS = 80; // margem extra pro fallback do setTimeout

export const CarrosselCartazes: React.FC<{ banners?: Banner[] }> = ({
  banners = bannersMock,
}) => {
  const total = banners.length;
  const extended = [banners[total - 1], ...banners, banners[0]];

  const [index, setIndex] = useState(1);
  const [withTransition, setWithTransition] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPausedRef = useRef(false);
  const isBusyRef = useRef(false); // trava a navegação durante a troca/reset
  const touchStartX = useRef(0);

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
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Faz o "salto invisível" de volta pro cartaz real, e destrava a navegação.
  // É chamada tanto pelo evento do navegador quanto pelo timeout de segurança —
  // a flag garante que só execute uma vez por transição.
  const performReset = useCallback((targetIndex: number) => {
    if (!isBusyRef.current) return; // já foi resetado, ignora chamada duplicada
    setWithTransition(false);
    setIndex(targetIndex);
    isBusyRef.current = false;
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
      resetTimeoutRef.current = null;
    }
  }, []);

  const goToIndex = useCallback((newIndex: number) => {
    if (isBusyRef.current) return; // ignora navegação enquanto uma troca está em andamento
    isBusyRef.current = true;
    setWithTransition(true);
    setIndex(newIndex);

    const willLandOnCloneEnd = newIndex === extended.length - 1;
    const willLandOnCloneStart = newIndex === 0;

    if (willLandOnCloneEnd || willLandOnCloneStart) {
      // Seguro: se o transitionend do navegador não disparar por algum motivo
      // (aba em segundo plano, transição interrompida, etc.), este timeout
      // garante o reset mesmo assim, evitando o índice "fugir" do intervalo válido.
      resetTimeoutRef.current = setTimeout(() => {
        performReset(willLandOnCloneEnd ? 1 : total);
      }, TRANSITION_MS + RESET_SAFETY_BUFFER_MS);
    } else {
      // Troca normal: libera a navegação assim que a transição visual termina
      resetTimeoutRef.current = setTimeout(() => {
        isBusyRef.current = false;
      }, TRANSITION_MS + RESET_SAFETY_BUFFER_MS);
    }
  }, [extended.length, total, performReset]);

  const next = useCallback(() => {
    setIndex((current) => {
      goToIndex(current + 1);
      return current;
    });
  }, [goToIndex]);

  const prev = useCallback(() => {
    setIndex((current) => {
      goToIndex(current - 1);
      return current;
    });
  }, [goToIndex]);

  const goToReal = useCallback((realIndex: number) => {
    goToIndex(realIndex + 1);
  }, [goToIndex]);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (!isPausedRef.current) next();
    }, AUTO_ADVANCE_MS);
  }, [next]);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
    };
  }, [startTimer]);

  const handleTransitionEnd = (e: React.TransitionEvent) => {
    if (e.target !== e.currentTarget) return; // ignora eventos borbulhados de filhos
    if (index === extended.length - 1) {
      performReset(1);
    } else if (index === 0) {
      performReset(total);
    } else {
      isBusyRef.current = false; // troca comum terminou, libera navegação
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
        resetTimeoutRef.current = null;
      }
    }
  };

  const handleManualNav = (action: () => void) => {
    action();
    startTimer();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') handleManualNav(next);
    if (e.key === 'ArrowLeft') handleManualNav(prev);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    isPausedRef.current = true;
    setIsDragging(true);
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setDragOffset(e.touches[0].clientX - touchStartX.current);
  };

  const handleTouchEnd = () => {
    if (dragOffset > SWIPE_THRESHOLD_PX) {
      handleManualNav(prev);
    } else if (dragOffset < -SWIPE_THRESHOLD_PX) {
      handleManualNav(next);
    }
    setDragOffset(0);
    setIsDragging(false);
    isPausedRef.current = false;
  };

  const realIndex = ((index - 1) % total + total) % total;
  const trackTransform = `translateX(calc(-${index * 100}% + ${dragOffset}px))`;

  return (
    <section
      ref={sectionRef}
      className={`${styles.wrapper} ${isVisible ? styles.isVisible : ''}`}
      aria-label="Acolhimento do calouro e banners de eventos"
    >
      <div className={styles.sectionHeader}>

        <div className={styles.titleGroup}>
          <h2 className={styles.sectionTitle}>
            Sua chegada merece uma <span className={styles.highlight}>festa</span>
          </h2>
          <div className={styles.accentBar} aria-hidden="true" />
        </div>

        <p className={styles.sectionSubtitle}>
          Confira os eventos preparados para te receber na Unimontes.
        </p>
      </div>

      <div
        className={styles.viewport}
        tabIndex={0}
        role="group"
        aria-roledescription="carrossel"
        onKeyDown={handleKeyDown}
        onMouseEnter={() => { isPausedRef.current = true; }}
        onMouseLeave={() => { isPausedRef.current = false; }}
        onFocus={() => { isPausedRef.current = true; }}
        onBlur={() => { isPausedRef.current = false; }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className={`${styles.track} ${isDragging ? styles.dragging : ''} ${!withTransition ? styles.noTransition : ''}`}
          style={{ transform: trackTransform, transitionDuration: `${TRANSITION_MS}ms` }}
          onTransitionEnd={handleTransitionEnd}
        >
          {extended.map((banner, i) => {
            const img = (
              <div className={styles.bannerFrame}>
                <img
                  src={banner.imagem}
                  alt={banner.alt}
                  className={styles.bannerImage}
                  loading={i === 1 ? 'eager' : 'lazy'}
                  draggable={false}
                />
              </div>
            );

            return (
              <div key={`${banner.id}-${i}`} className={styles.slide}>
                {banner.link ? (
                  <a href={banner.link} className={styles.bannerLink} aria-label={banner.alt}>
                    {img}
                  </a>
                ) : (
                  img
                )}
              </div>
            );
          })}
        </div>

        <button
          type="button"
          className={`${styles.arrowButton} ${styles.arrowLeft}`}
          onClick={() => handleManualNav(prev)}
          aria-label="Banner anterior"
        >
          ‹
        </button>
        <button
          type="button"
          className={`${styles.arrowButton} ${styles.arrowRight}`}
          onClick={() => handleManualNav(next)}
          aria-label="Próximo banner"
        >
          ›
        </button>
      </div>

      <div className={styles.dots}>
        {banners.map((banner, i) => (
          <button
            key={banner.id}
            type="button"
            className={`${styles.dot} ${i === realIndex ? styles.dotActive : ''}`}
            onClick={() => handleManualNav(() => goToReal(i))}
            aria-label={`Ir para o banner ${i + 1}`}
            aria-current={i === realIndex}
          />
        ))}
      </div>
    </section>
  );
};

export default CarrosselCartazes;