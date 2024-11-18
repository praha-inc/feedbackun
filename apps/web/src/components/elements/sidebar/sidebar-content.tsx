import { Slot } from '@radix-ui/react-slot';
import { clsx } from 'clsx';
import { forwardRef } from 'react';

import * as styles from './sidebar.css';

import type { ComponentPropsWithoutRef, ForwardRefRenderFunction, ElementRef } from 'react';

export type SidebarContentProps = ComponentPropsWithoutRef<'div'> & {
  asChild?: boolean | undefined;
};

const SidebarContentRender: ForwardRefRenderFunction<ElementRef<'div'>, SidebarContentProps> = ({
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
      className={clsx(styles.content, className)}
    >
      {children}
    </Wrapper>
  );
};

export const SidebarContent = forwardRef(SidebarContentRender);
