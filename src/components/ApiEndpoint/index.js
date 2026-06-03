import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export default function ApiEndpoint({ method = 'GET', path = '' }) {
  const verb = String(method).toLowerCase();

  return (
    <span className={styles.endpoint}>
      <span className={clsx(styles.method, styles[verb])}>{method}</span>
      <span className={styles.path}>{path}</span>
    </span>
  );
}
