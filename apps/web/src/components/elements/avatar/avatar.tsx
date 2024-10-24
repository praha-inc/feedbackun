import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { clsx } from 'clsx';
import { forwardRef } from 'react';

import * as styles from './avatar.css';

import type { ForwardRefRenderFunction } from 'react';

export type AvatarProps = AvatarPrimitive.AvatarProps;

const AvatarRender: ForwardRefRenderFunction<HTMLDivElement, AvatarProps> = ({
  className,
  children,
  ...props
}, ref) => {
  return (
    <AvatarPrimitive.Root
      {...props}
      ref={ref}
      className={clsx(styles.wrapper, className)}
    >
      {children}
    </AvatarPrimitive.Root>
  );
};

export const Avatar = forwardRef(AvatarRender);
