import { Slot } from '@radix-ui/react-slot';
import { clsx } from 'clsx';

import * as styles from './badge.css';

import type { ComponentPropsWithoutRef, FC } from 'react';

export type BadgeProps = ComponentPropsWithoutRef<'div'> & {
  asChild?: boolean | undefined;
};

export const Badge: FC<BadgeProps> = ({
  className,
  children,
  asChild,
  ...props
}) => {
  const Wrapper = asChild ? Slot : 'div';

  return (
    <Wrapper
      {...props}
      className={clsx(styles.wrapper, className)}
    >
      {children}
    </Wrapper>
  );
};
