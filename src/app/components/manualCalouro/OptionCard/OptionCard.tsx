import React from 'react';
import { OptionCardProps } from '../types';
import styles from './OptionCard.module.css';

export const OptionCard: React.FC<OptionCardProps> = ({
  icon,
  title,
  subtitle,
  href,
  isExternal = false,
  isHighlight = false,
}) => {
  const cardClassName = `${styles.optionCard} ${isHighlight ? styles.highlight : ''}`;

  return (
    <a
      href={href}
      className={cardClassName}
      target={isExternal ? '_blank' : '_self'}
      rel={isExternal ? 'noopener noreferrer' : undefined}
    >
      <div className={styles.icon}>{icon}</div>
      <div className={styles.cardContent}>
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
      <span className={styles.arrow}>&gt;</span>
    </a>
  );
};