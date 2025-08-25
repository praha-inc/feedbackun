import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { clsx } from 'clsx';

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
