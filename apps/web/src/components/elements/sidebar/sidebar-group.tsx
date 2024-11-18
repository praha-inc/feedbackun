import { Slot } from '@radix-ui/react-slot';
import { clsx } from 'clsx';
import { forwardRef } from 'react';

import * as styles from './sidebar.css';

import type { ComponentPropsWithoutRef, ForwardRefRenderFunction, ElementRef } from 'react';

export type SidebarGroupProps = ComponentPropsWithoutRef<'div'> & {
  asChild?: boolean | undefined;
};

const SidebarGroupRender: ForwardRefRenderFunction<ElementRef<'div'>, SidebarGroupProps> = ({
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
      className={clsx(styles.group, className)}
    >
      {children}
    </Wrapper>
  );
};

export const SidebarGroup = forwardRef(SidebarGroupRender);
