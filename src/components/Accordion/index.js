import React from 'react';
import * as RadixAccordion from '@radix-ui/react-accordion';
import styles from './styles.module.css';

export function Accordion({ type = 'single', collapsible = true, children }) {
  return (
    <RadixAccordion.Root
      type={type}
      collapsible={type === 'single' ? collapsible : undefined}
      className={styles.root}
    >
      {children}
    </RadixAccordion.Root>
  );
}

export function AccordionItem({ value, title, children }) {
  return (
    <RadixAccordion.Item value={value} className={styles.item}>
      <RadixAccordion.Header className={styles.header}>
        <RadixAccordion.Trigger className={styles.trigger}>
          <span>{title}</span>
          <svg
            className={styles.chevron}
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </RadixAccordion.Trigger>
      </RadixAccordion.Header>
      <RadixAccordion.Content className={styles.content}>
        <div className={styles.contentInner}>{children}</div>
      </RadixAccordion.Content>
    </RadixAccordion.Item>
  );
}

export default Accordion;
