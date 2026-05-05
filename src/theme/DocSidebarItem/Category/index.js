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
            <span className="sidebar-item-label">
              <Icon icon={icon} width="18" height="18" className="sidebar-item-icon" />
              <span className="sidebar-item-text">{item.label}</span>
            </span>
          ),
        }}
      />
    );
  }

  return <Category {...props} />;
}
