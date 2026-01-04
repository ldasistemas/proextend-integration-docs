import React from 'react';
import { Icon } from '@iconify/react';

export default function CategoryIcon({ icon, label }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Icon icon={icon} width="18" height="18" style={{ flexShrink: 0 }} />
      <span>{label}</span>
    </span>
  );
}
