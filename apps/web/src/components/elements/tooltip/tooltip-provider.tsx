'use client';

import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import type { ComponentProps } from 'react';

export type TooltipProviderProps = ComponentProps<typeof TooltipPrimitive.Provider>;

export const TooltipProvider = TooltipPrimitive.Provider;
