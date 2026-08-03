import { clsx } from 'clsx';
import { ScrollArea as ScrollAreaPrimitive } from 'radix-ui';

import * as styles from './scroll-area.css';

import type { FC, ComponentProps } from 'react';

export type ScrollAreaViewportProps = ComponentProps<typeof ScrollAreaPrimitive.Viewport>;

export const ScrollAreaViewport: FC<ScrollAreaViewportProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <ScrollAreaPrimitive.Viewport
      {...props}
      className={clsx(styles.container, className)}
    >
      {children}
    </ScrollAreaPrimitive.Viewport>
  );
};
