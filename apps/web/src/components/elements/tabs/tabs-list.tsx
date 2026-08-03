'use client';

import { clsx } from 'clsx';
import { Tabs as TabsPrimitive } from 'radix-ui';

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
