'use client';

import * as TabsPrimitive from '@radix-ui/react-tabs';

import type { ComponentPropsWithoutRef } from 'react';

export type TabsProps = ComponentPropsWithoutRef<typeof TabsPrimitive.Root>;

export const Tabs = TabsPrimitive.Root;
