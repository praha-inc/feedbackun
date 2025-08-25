import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { clsx } from 'clsx';

import * as styles from './avatar.css';

import type { FC, ComponentProps } from 'react';

export type AvatarImageProps = ComponentProps<typeof AvatarPrimitive.Image>;

export const AvatarImage: FC<AvatarImageProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <AvatarPrimitive.Image
      {...props}
      className={clsx(styles.image, className)}
    >
      {children}
    </AvatarPrimitive.Image>
  );
};
