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
            <span className="sidebar-item-label">
              <Icon icon={icon} width="18" height="18" className="sidebar-item-icon" />
              <span className="sidebar-item-text">{item.label}</span>
            </span>
          ),
        }}
      />
    );
  }

  return <Link {...props} />;
}
