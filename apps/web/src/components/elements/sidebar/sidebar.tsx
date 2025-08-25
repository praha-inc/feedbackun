'use client';

import { clsx } from 'clsx';

import { useSidebar } from './sidebar-provider';
import * as styles from './sidebar.css';
import { SheetContent } from '../sheet';

import type { FC, ComponentProps } from 'react';

export type SidebarProps = ComponentProps<'div'>;

export const Sidebar: FC<SidebarProps> = ({
  className,
  children,
  ...props
}) => {
  const { expand, shouldUseSheet } = useSidebar();

  if (shouldUseSheet) {
    return (
      <SheetContent>
        {children}
      </SheetContent>
    );
  }

  return (
    <div
      {...props}
      className={clsx(styles.sidebar({ expand }), className)}
    >
      {children}
    </div>
  );
};
