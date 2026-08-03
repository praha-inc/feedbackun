'use client';

import { Tabs as TabsPrimitive } from 'radix-ui';

import type { ComponentProps } from 'react';

export type TabsContentProps = ComponentProps<typeof TabsPrimitive.Content>;

export const TabsContent = TabsPrimitive.Content;
