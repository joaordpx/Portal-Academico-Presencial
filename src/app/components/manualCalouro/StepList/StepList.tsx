import React from 'react';
import { StepItemData } from '../types';
import styles from './StepList.module.css';

interface StepListProps {
  steps: StepItemData[];
}

export const StepList: React.FC<StepListProps> = ({ steps }) => {
  return (
    <div className={styles.stepsList}>
      {steps.map((step) => (
        <div key={step.number} className={styles.stepItem}>
          <div className={styles.stepNumber}>{step.number}</div>
          <div className={styles.stepDetails}>
            <h4>{step.title}</h4>
            <p>{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};