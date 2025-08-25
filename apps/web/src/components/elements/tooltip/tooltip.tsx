'use client';

import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import type { ComponentProps } from 'react';

export type TooltipProps = ComponentProps<typeof TooltipPrimitive.Root>;

export const Tooltip = TooltipPrimitive.Root;
