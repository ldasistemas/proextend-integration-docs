import React from 'react';
import Link from '@theme-original/DocSidebarItem/Link';
import { Icon } from '@iconify/react';

export default function LinkWrapper(props) {
  const { item } = props;
  const icon = item.customProps?.icon;

  if (icon) {
    return (
      <Link
        {...props}
        item={{
          ...item,
          label: (
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Icon icon={icon} width="18" height="18" style={{ flexShrink: 0 }} />
              <span>{item.label}</span>
            </span>
          ),
        }}
      />
    );
  }

  return <Link {...props} />;
}
