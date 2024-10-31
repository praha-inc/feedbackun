'use client';

import * as TabsPrimitive from '@radix-ui/react-tabs';

import type { ComponentPropsWithoutRef } from 'react';

export type TabsContentProps = ComponentPropsWithoutRef<typeof TabsPrimitive.Content>;

export const TabsContent = TabsPrimitive.Content;
