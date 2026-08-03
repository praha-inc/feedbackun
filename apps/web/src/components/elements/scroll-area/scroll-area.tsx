import { clsx } from 'clsx';
import { ScrollArea as ScrollAreaPrimitive } from 'radix-ui';

import * as styles from './scroll-area.css';

import type { FC, ComponentProps } from 'react';

export type ScrollAreaProps = ComponentProps<typeof ScrollAreaPrimitive.Root>;

export const ScrollArea: FC<ScrollAreaProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <ScrollAreaPrimitive.Root
      {...props}
      className={clsx(styles.wrapper, className)}
    >
      {children}
    </ScrollAreaPrimitive.Root>
  );
};
