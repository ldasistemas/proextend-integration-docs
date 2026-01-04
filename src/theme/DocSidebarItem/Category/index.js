import React from 'react';
import Category from '@theme-original/DocSidebarItem/Category';
import { Icon } from '@iconify/react';

export default function CategoryWrapper(props) {
  const { item } = props;
  const icon = item.customProps?.icon;

  if (icon) {
    return (
      <Category
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

  return <Category {...props} />;
}
