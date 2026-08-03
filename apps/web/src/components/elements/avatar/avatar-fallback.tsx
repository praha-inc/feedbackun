import { clsx } from 'clsx';
import { Avatar as AvatarPrimitive } from 'radix-ui';

import * as styles from './avatar.css';

import type { FC, ComponentProps } from 'react';

export type AvatarFallbackProps = ComponentProps<typeof AvatarPrimitive.Fallback>;

export const AvatarFallback: FC<AvatarFallbackProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <AvatarPrimitive.Fallback
      {...props}
      className={clsx(styles.fallback, className)}
    >
      {children}
    </AvatarPrimitive.Fallback>
  );
};
