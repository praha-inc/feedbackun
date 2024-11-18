import { Slot } from '@radix-ui/react-slot';
import { clsx } from 'clsx';
import { forwardRef } from 'react';

import * as styles from './sidebar.css';

import type { ComponentPropsWithoutRef, ForwardRefRenderFunction, ElementRef } from 'react';

export type SidebarHeaderProps = ComponentPropsWithoutRef<'div'> & {
  asChild?: boolean | undefined;
};

const SidebarHeaderRender: ForwardRefRenderFunction<ElementRef<'div'>, SidebarHeaderProps> = ({
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
      className={clsx(styles.header, className)}
    >
      {children}
    </Wrapper>
  );
};

export const SidebarHeader = forwardRef(SidebarHeaderRender);
