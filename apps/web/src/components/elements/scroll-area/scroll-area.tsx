import { clsx } from 'clsx';
import { ScrollArea as ScrollAreaPrimitive } from 'radix-ui';

import { ScrollAreaBar } from './scroll-area-bar';
import * as styles from './scroll-area.css';

import type { FC, ComponentProps } from 'react';

export type ScrollAreaProps = ComponentProps<typeof ScrollAreaPrimitive.Root> & {
  vertical?: boolean | undefined;
  horizontal?: boolean | undefined;
};

export const ScrollArea: FC<ScrollAreaProps> = ({
  className,
  children,
  vertical,
  horizontal,
  ...props
}) => {
  return (
    <ScrollAreaPrimitive.Root
      {...props}
      className={clsx(styles.wrapper, className)}
    >
      {children}
      {vertical && <ScrollAreaBar orientation="vertical" />}
      {horizontal && <ScrollAreaBar orientation="horizontal" />}
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
};
