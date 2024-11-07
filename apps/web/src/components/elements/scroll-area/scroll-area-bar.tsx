import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import { clsx } from 'clsx';
import { forwardRef } from 'react';

import * as styles from './scroll-area.css';

import type { ElementRef, ComponentPropsWithoutRef, ForwardRefRenderFunction } from 'react';

export type ScrollAreaBarProps = ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>;

const ScrollAreaBarRender: ForwardRefRenderFunction<ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>, ScrollAreaBarProps> = ({
  className,
  ...props
}, ref) => {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      {...props}
      ref={ref}
      className={clsx(styles.bar({ orientation: props.orientation }), className)}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb className={styles.thumb} />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
};

export const ScrollAreaBar = forwardRef(ScrollAreaBarRender);
