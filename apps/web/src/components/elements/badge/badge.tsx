import { Slot } from '@radix-ui/react-slot';
import { clsx } from 'clsx';
import { forwardRef } from 'react';

import * as styles from './badge.css';

import type { ComponentPropsWithoutRef, ElementRef, ForwardRefRenderFunction } from 'react';

export type BadgeProps = ComponentPropsWithoutRef<'div'> & {
  asChild?: boolean | undefined;
};

const BadgeRender: ForwardRefRenderFunction<ElementRef<'div'>, BadgeProps> = ({
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
      className={clsx(styles.wrapper, className)}
    >
      {children}
    </Wrapper>
  );
};

export const Badge = forwardRef(BadgeRender);
