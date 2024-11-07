import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { clsx } from 'clsx';
import { forwardRef } from 'react';

import * as styles from './avatar.css';

import type { ForwardRefRenderFunction, ComponentPropsWithoutRef, ElementRef } from 'react';

export type AvatarProps = ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>;

const AvatarRender: ForwardRefRenderFunction<ElementRef<typeof AvatarPrimitive.Root>, AvatarProps> = ({
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
