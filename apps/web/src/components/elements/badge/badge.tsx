import { clsx } from 'clsx';
import { Slot as SlotPrimitive } from 'radix-ui';

import * as styles from './badge.css';

import type { FC, ComponentProps } from 'react';

export type BadgeProps = ComponentProps<'div'> & {
  asChild?: boolean | undefined;
};

export const Badge: FC<BadgeProps> = ({
  className,
  children,
  asChild,
  ...props
}) => {
  const Wrapper = asChild ? SlotPrimitive.Slot : 'div';

  return (
    <Wrapper
      {...props}
      className={clsx(styles.wrapper, className)}
    >
      {children}
    </Wrapper>
  );
};
