import { clsx } from 'clsx';
import { Avatar as AvatarPrimitive } from 'radix-ui';

import * as styles from './avatar.css';

import type { FC, ComponentProps } from 'react';

export type AvatarProps = ComponentProps<typeof AvatarPrimitive.Root>;

export const Avatar: FC<AvatarProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <AvatarPrimitive.Root
      {...props}
      className={clsx(styles.wrapper, className)}
    >
      {children}
    </AvatarPrimitive.Root>
  );
};
