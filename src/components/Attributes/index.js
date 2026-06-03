import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export function Attributes({ children }) {
  return <dl className={styles.list}>{children}</dl>;
}

export function Attr({ name, type, required, children }) {
  return (
    <div className={styles.row}>
      <dt className={styles.term}>
        <code className={styles.name}>{name}</code>
        {type && <span className={styles.type}>{type}</span>}
        {required != null && (
          <span className={clsx(styles.badge, required ? styles.req : styles.opt)}>
            {required ? 'obrigatório' : 'opcional'}
          </span>
        )}
      </dt>
      <dd className={styles.desc}>{children}</dd>
    </div>
  );
}

export function AttrValues({ children }) {
  return <ul className={styles.values}>{children}</ul>;
}

export function AttrValue({ value, children }) {
  return (
    <li className={styles.value}>
      {value != null && <code className={styles.valueKey}>{String(value)}</code>}
      <span className={styles.valueText}>{children}</span>
    </li>
  );
}

export default Attributes;
