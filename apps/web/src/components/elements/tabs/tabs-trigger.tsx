'use client';

import * as TabsPrimitive from '@radix-ui/react-tabs';
import { clsx } from 'clsx';

import * as styles from './tabs.css';

import type { FC, ComponentProps } from 'react';

export type TabsTriggerProps = ComponentProps<typeof TabsPrimitive.Trigger>;

export const TabsTrigger: FC<TabsTriggerProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <TabsPrimitive.Trigger
      {...props}
      className={clsx(styles.trigger, className)}
    >
      {children}
    </TabsPrimitive.Trigger>
  );
};
