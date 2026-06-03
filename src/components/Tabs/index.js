import React from 'react';
import * as RadixTabs from '@radix-ui/react-tabs';
import styles from './styles.module.css';

export function Tabs({ defaultValue, items = [], children }) {
  const first = defaultValue ?? items[0]?.value;
  return (
    <RadixTabs.Root className={styles.root} defaultValue={first}>
      <RadixTabs.List className={styles.list}>
        {items.map((item) => (
          <RadixTabs.Trigger key={item.value} value={item.value} className={styles.trigger}>
            {item.label}
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>
      {children}
    </RadixTabs.Root>
  );
}

export function Tab({ value, children }) {
  return (
    <RadixTabs.Content value={value} className={styles.content}>
      {children}
    </RadixTabs.Content>
  );
}

export default Tabs;
