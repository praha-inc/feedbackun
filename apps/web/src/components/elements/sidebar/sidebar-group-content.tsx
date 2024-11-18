import { Slot } from '@radix-ui/react-slot';
import { clsx } from 'clsx';
import { forwardRef } from 'react';

import * as styles from './sidebar.css';

import type { ComponentPropsWithoutRef, ForwardRefRenderFunction, ElementRef } from 'react';

export type SidebarGroupContentProps = ComponentPropsWithoutRef<'div'> & {
  asChild?: boolean | undefined;
};

const SidebarGroupContentRender: ForwardRefRenderFunction<ElementRef<'div'>, SidebarGroupContentProps> = ({
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
      className={clsx(styles.groupContent, className)}
    >
      {children}
    </Wrapper>
  );
};

export const SidebarGroupContent = forwardRef(SidebarGroupContentRender);
