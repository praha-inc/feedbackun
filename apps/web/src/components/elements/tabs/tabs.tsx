'use client';

import { Tabs as TabsPrimitive } from 'radix-ui';

import type { ComponentProps } from 'react';

export type TabsProps = ComponentProps<typeof TabsPrimitive.Root>;

export const Tabs = TabsPrimitive.Root;
