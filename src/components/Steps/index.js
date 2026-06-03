import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export function Steps({ children, className }) {
  return <div className={clsx(styles.steps, className)}>{children}</div>;
}

export function Step({ title, children, className }) {
  return (
    <div className={clsx(styles.step, className)}>
      {title && <div className={styles.stepTitle}>{title}</div>}
      <div className={styles.stepBody}>{children}</div>
    </div>
  );
}

export default Steps;
