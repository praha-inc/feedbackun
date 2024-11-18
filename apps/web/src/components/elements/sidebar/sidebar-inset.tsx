import { Slot } from '@radix-ui/react-slot';
import { clsx } from 'clsx';
import { forwardRef } from 'react';

import * as styles from './sidebar.css';

import type { ComponentPropsWithoutRef, ForwardRefRenderFunction, ElementRef } from 'react';

export type SidebarInsetProps = ComponentPropsWithoutRef<'div'> & {
  asChild?: boolean | undefined;
};

const SidebarInsetRender: ForwardRefRenderFunction<ElementRef<'div'>, SidebarInsetProps> = ({
  className,
  children,
  asChild,
  ...props
}, ref) => {
  const Wrapper = asChild ? Slot : 'div';

  return (
    <Wrapper
      {...props}
      ref={ref}
      className={clsx(styles.inset, className)}
    >
      {children}
    </Wrapper>
  );
};

export const SidebarInset = forwardRef(SidebarInsetRender);
