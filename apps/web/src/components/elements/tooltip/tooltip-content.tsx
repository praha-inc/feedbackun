'use client';

import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { clsx } from 'clsx';

import * as styles from './tooltip.css';

import type { FC, ComponentProps } from 'react';

export type TooltipContentProps = Omit<ComponentProps<typeof TooltipPrimitive.Content>, 'sideOffset'>;

export const TooltipContent: FC<TooltipContentProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        {...props}
        className={clsx(styles.content, className)}
        sideOffset={4}
      >
        {children}
        <TooltipPrimitive.Arrow />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
};
