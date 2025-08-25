'use client';

import * as TabsPrimitive from '@radix-ui/react-tabs';
import { clsx } from 'clsx';

import * as styles from './tabs.css';

import type { FC, ComponentProps } from 'react';

export type TabsListProps = ComponentProps<typeof TabsPrimitive.List>;

export const TabsList: FC<TabsListProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <TabsPrimitive.List
      {...props}
      className={clsx(styles.list, className)}
    >
      {children}
    </TabsPrimitive.List>
  );
};
