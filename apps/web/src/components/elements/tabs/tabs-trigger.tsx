'use client';

import * as TabsPrimitive from '@radix-ui/react-tabs';
import { clsx } from 'clsx';
import { forwardRef } from 'react';

import * as styles from './tabs.css';

import type { ElementRef, ComponentPropsWithoutRef, ForwardRefRenderFunction } from 'react';

export type TabsTriggerProps = ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>;

const TabsTriggerRender: ForwardRefRenderFunction<ElementRef<typeof TabsPrimitive.Trigger>, TabsTriggerProps> = ({
  className,
  children,
  ...props
}, ref) => {
  return (
    <TabsPrimitive.Trigger
      {...props}
      ref={ref}
      className={clsx(styles.trigger, className)}
    >
      {children}
    </TabsPrimitive.Trigger>
  );
};

export const TabsTrigger = forwardRef(TabsTriggerRender);
