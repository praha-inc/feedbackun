import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import { clsx } from 'clsx';

import { ScrollAreaBar } from './scroll-area-bar';
import * as styles from './scroll-area.css';

import type { FC, ComponentProps } from 'react';

export type ScrollAreaViewportProps = ComponentProps<typeof ScrollAreaPrimitive.Viewport> & {
  vertical?: boolean | undefined;
  horizontal?: boolean | undefined;
};

export const ScrollAreaViewport: FC<ScrollAreaViewportProps> = ({
  className,
  children,
  vertical,
  horizontal,
  ...props
}) => {
  return (
    <ScrollAreaPrimitive.Viewport
      {...props}
      className={clsx(styles.container, className)}
    >
      {children}
      {vertical && <ScrollAreaBar orientation="vertical" />}
      {horizontal && <ScrollAreaBar orientation="horizontal" />}
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Viewport>
  );
};
