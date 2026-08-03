'use client';

import { clsx } from 'clsx';
import { Tabs as TabsPrimitive } from 'radix-ui';

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
