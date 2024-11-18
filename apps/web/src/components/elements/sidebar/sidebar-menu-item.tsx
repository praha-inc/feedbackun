import { Slot } from '@radix-ui/react-slot';
import { clsx } from 'clsx';
import { forwardRef } from 'react';

import * as styles from './sidebar.css';

import type { ComponentPropsWithoutRef, ForwardRefRenderFunction, ElementRef } from 'react';

export type SidebarMenuItemProps = ComponentPropsWithoutRef<'li'> & {
  asChild?: boolean | undefined;
};

const SidebarMenuItemRender: ForwardRefRenderFunction<ElementRef<'li'>, SidebarMenuItemProps> = ({
  className,
  children,
  asChild,
  ...props
}, ref) => {
  const Wrapper = asChild ? Slot : 'li';

  return (
    <Wrapper
      {...props}
      ref={ref}
      className={clsx(styles.menuItem, className)}
    >
      {children}
    </Wrapper>
  );
};

export const SidebarMenuItem = forwardRef(SidebarMenuItemRender);
