import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import { clsx } from 'clsx';
import { forwardRef } from 'react';

import * as styles from './scroll-area.css';

import type { ForwardRefRenderFunction, ComponentPropsWithoutRef, ElementRef } from 'react';

export type ScrollAreaProps = ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>;

const ScrollAreaRender: ForwardRefRenderFunction<ElementRef<typeof ScrollAreaPrimitive.Root>, ScrollAreaProps> = ({
  className,
  children,
  ...props
}, ref) => {
  return (
    <ScrollAreaPrimitive.Root
      {...props}
      ref={ref}
      className={clsx(styles.wrapper, className)}
    >
      {children}
    </ScrollAreaPrimitive.Root>
  );
};

export const ScrollArea = forwardRef(ScrollAreaRender);
