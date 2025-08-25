'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';

import type { ComponentProps } from 'react';

export type SheetProps = ComponentProps<typeof DialogPrimitive.Root>;

export const Sheet = DialogPrimitive.Root;
