// PilaresUnimontes.tsx
import React, { useEffect, useRef, useState } from 'react';
import styles from './PilaresUnimontes.module.css';

interface PilarItem {
  id: string;
  title: string;
  description: string;
  iconSvg: React.ReactNode;
}

const items: PilarItem[] = [
  {
    id: 'ensino',
    title: 'Ensino',
    description: 'cursos de graduação e pós-graduação.',
    iconSvg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
  },
  {
    id: 'pesquisa',
    title: 'Pesquisa',
    description: 'produção de conhecimento, inovação científica.',
    iconSvg: (
      /* Ícone de Microscópio */
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 18h8" />
        <path d="M3 22h18" />
        <path d="M14 22a7 7 0 1 0 0-14h-1" />
        <path d="M9 14h2" />
        <path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2" />
        <path d="M12 6V2h2" />
      </svg>
    ),
  },
  {
    id: 'inovacao',
    title: 'Inovação',
    description: 'desenvolvimento de soluções sociais, científicas e tecnológicas.',
    iconSvg: (
      /* Ícone de Lâmpada */
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.8.7 1.3 1.5 1.5 2.5" />
        <path d="M9 18h6" />
        <path d="M10 22h4" />
      </svg>
    ),
  },
  {
    id: 'extensao',
    title: 'Extensão',
    description: 'ações construídas com a comunidade.',
    iconSvg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87m-4-12a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

export const PilaresUnimontes: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={`${styles.wrapper} ${isVisible ? styles.animateIn : ''}`}
    >
      <div className={styles.container}>
        
        {/* Título com linha decorativa */}
        <div className={styles.titleWrapper}>
          <h2 className={styles.mainTitle}>O que a Unimontes tem</h2>
          <div className={styles.titleLine} />
        </div>

        {/* Grid de Cards Azuis */}
        <div className={styles.cardsGrid}>
          {items.map((item, index) => (
            <div 
              key={item.id} 
              className={styles.card}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={styles.iconContainer}>
                {item.iconSvg}
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardDescription}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};