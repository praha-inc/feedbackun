'use client';

import { clsx } from 'clsx';
import { forwardRef } from 'react';

import { useSidebar } from './sidebar-provider';
import * as styles from './sidebar.css';
import { SheetContent } from '../sheet';

import type { ComponentPropsWithoutRef, ForwardRefRenderFunction, ElementRef } from 'react';

export type SidebarProps = ComponentPropsWithoutRef<'div'>;

const SidebarRender: ForwardRefRenderFunction<ElementRef<'div'>, SidebarProps> = ({
  className,
  children,
  ...props
}, ref) => {
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
      ref={ref}
      className={clsx(styles.sidebar({ expand }), className)}
    >
      {children}
    </div>
  );
};

export const Sidebar = forwardRef(SidebarRender);
