import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import { clsx } from 'clsx';

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
