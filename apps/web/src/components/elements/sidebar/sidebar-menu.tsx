import { Slot } from '@radix-ui/react-slot';
import { clsx } from 'clsx';
import { forwardRef } from 'react';

import * as styles from './sidebar.css';

import type { ComponentPropsWithoutRef, ForwardRefRenderFunction, ElementRef } from 'react';

export type SidebarMenuProps = ComponentPropsWithoutRef<'ul'> & {
  asChild?: boolean | undefined;
};

const SidebarMenuRender: ForwardRefRenderFunction<ElementRef<'ul'>, SidebarMenuProps> = ({
  className,
  children,
  asChild,
  ...props
}, ref) => {
  const Wrapper = asChild ? Slot : 'ul';

  return (
    <Wrapper
      {...props}
      ref={ref}
      className={clsx(styles.menu, className)}
    >
      {children}
    </Wrapper>
  );
};

export const SidebarMenu = forwardRef(SidebarMenuRender);
