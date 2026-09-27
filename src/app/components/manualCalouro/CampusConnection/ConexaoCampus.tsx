import React, { useEffect, useRef, useState } from 'react';
import styles from './ConexaoCampus.module.css';

interface ConexaoItem {
  id: string;
  emoji: string;
  tag: string;
  title: string;
  description: string;
  link: string;
}

const conexoes: ConexaoItem[] = [
  {
    id: 'wifi',
    emoji: '📡',
    tag: 'Sem Fio',
    title: 'Wi-Fi Eduroam',
    description: 'Internet rápida no campus inteiro. Configure uma vez e conecte no celular e note sempre.',
    link: '#wifi',
  },
  {
    id: 'email',
    emoji: '📩',
    tag: 'Vantagens',
    title: 'Seu E-mail Institucional',
    description: 'Ganha Google Workspace, desconto no Spotify, Canva Pro grátis e acesso aos avisos.',
    link: '#email',
  },
  {
    id: 'portal',
    emoji: '📊',
    tag: 'Notas & Aulas',
    title: 'Portal WebGiz',
    description: 'Seu diário de bordo. Veja sua grade horária, frequência nas aulas e faltas em tempo real.',
    link: '#portal',
  },
  {
    id: 'carteirinha',
    emoji: '🪪',
    tag: 'Passe Livre',
    title: 'Carteirinha Digital',
    description: 'Sua identificação oficial direto no celular para passar nas catracas e eventos.',
    link: '#carteirinha',
  },
  {
    id: 'ru',
    emoji: '🍽️',
    tag: 'Rango Barato',
    title: 'Restaurante Universitário',
    description: 'Comida boa e super acessível. Veja o cardápio da semana e compre seus tickets online.',
    link: '#ru',
  },
  {
    id: 'biblioteca',
    emoji: '📚',
    tag: 'Estudo & Foco',
    title: 'Biblioteca & Salas',
    description: 'Ambiente climatizado para estudar entre as aulas, além de milhares de livros digitais.',
    link: '#biblioteca',
  },
];

export const ConexaoCampus: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={styles.sectionContainer}>
      {/* Luzes orgânicas de fundo para dar calor visual */}
      <div className={styles.warmGlowLeft} />
      <div className={styles.warmGlowRight} />

      <div className={styles.contentWrapper}>
        
        {/* Header Acolhedor e Jovem */}
        <div className={`${styles.header} ${isVisible ? styles.animatePop : ''}`}>
          <div className={styles.pillBadge}>
            <span className={styles.sparkle}>✨</span>
            <span>Kit de Sobrevivência do Calouro</span>
          </div>

          <h2 className={styles.title}>
            Tudo pronto pro seu <br />
            <span className={styles.handwrittenHighlight}>primeiro dia no campus?</span>
          </h2>

          <p className={styles.subtitle}>
            Relaxa! A gente separou as 6 coisas mais importantes para você ativar agora e não passar aperto.
          </p>
        </div>

        {/* Grid de Cards Estilo Bouncy/App */}
        <div className={styles.grid}>
          {conexoes.map((item, index) => (
            <a
              key={item.id}
              href={item.link}
              className={`${styles.card} ${isVisible ? styles.animateCardUp : ''}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={styles.cardHeader}>
                <div className={styles.emojiBubble}>{item.emoji}</div>
                <span className={styles.tagPill}>{item.tag}</span>
              </div>

              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardDescription}>{item.description}</p>
              </div>

              <div className={styles.cardFooter}>
                <span className={styles.actionText}>Bora ativar</span>
                <div className={styles.arrowIcon}>→</div>
              </div>
            </a>
          ))}
        </div>

        {/* Mensagem Amigável de Boas-Vindas */}
        <div className={`${styles.friendlyNote} ${isVisible ? styles.animatePop : ''}`} style={{ animationDelay: '700ms' }}>
          <div className={styles.noteEmoji}>👋</div>
          <div className={styles.noteText}>
            <strong>Ainda tá meio perdido? Faz parte!</strong>
            <span>Procura a galera de camiseta da DTI no Prédio Central que a gente configura tudo junto com você.</span>
          </div>
        </div>

      </div>
    </section>
  );
};