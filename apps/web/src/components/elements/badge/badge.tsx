import { clsx } from 'clsx';

import * as styles from './badge.css';

import type { ComponentPropsWithoutRef, FC } from 'react';

export type BadgeProps = ComponentPropsWithoutRef<'div'>;

export const Badge: FC<BadgeProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      {...props}
      className={clsx(styles.wrapper, className)}
    >
      {children}
    </div>
  );
};
