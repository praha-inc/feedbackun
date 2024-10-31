'use client';

import * as TabsPrimitive from '@radix-ui/react-tabs';
import { clsx } from 'clsx';
import { forwardRef } from 'react';

import * as styles from './tabs.css';

import type { ElementRef, ComponentPropsWithoutRef, ForwardRefRenderFunction } from 'react';

export type TabsListProps = ComponentPropsWithoutRef<typeof TabsPrimitive.List>;

const TabsListRender: ForwardRefRenderFunction<ElementRef<typeof TabsPrimitive.List>, TabsListProps> = ({
  className,
  children,
  ...props
}, ref) => {
  return (
    <TabsPrimitive.List
      {...props}
      ref={ref}
      className={clsx(styles.list, className)}
    >
      {children}
    </TabsPrimitive.List>
  );
};

export const TabsList = forwardRef(TabsListRender);
