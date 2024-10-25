import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import { clsx } from 'clsx';
import { forwardRef } from 'react';

import { ScrollAreaBar } from './scroll-area-bar';
import * as styles from './scroll-area.css';

import type { ForwardRefRenderFunction } from 'react';

export type ScrollAreaViewportProps = ScrollAreaPrimitive.ScrollAreaViewportProps & {
  vertical?: boolean | undefined;
  horizontal?: boolean | undefined;
};

const ScrollAreaViewportRender: ForwardRefRenderFunction<HTMLDivElement, ScrollAreaViewportProps> = ({
  className,
  children,
  vertical,
  horizontal,
  ...props
}, ref) => {
  return (
    <ScrollAreaPrimitive.Viewport
      {...props}
      ref={ref}
      className={clsx(styles.container, className)}
    >
      {children}
      {vertical && <ScrollAreaBar orientation="vertical" />}
      {horizontal && <ScrollAreaBar orientation="horizontal" />}
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Viewport>
  );
};

export const ScrollAreaViewport = forwardRef(ScrollAreaViewportRender);
