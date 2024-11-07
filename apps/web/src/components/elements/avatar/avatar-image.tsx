import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { clsx } from 'clsx';
import { forwardRef } from 'react';

import * as styles from './avatar.css';

import type { ForwardRefRenderFunction, ComponentPropsWithoutRef, ElementRef } from 'react';

export type AvatarImageProps = ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>;

const AvatarImageRender: ForwardRefRenderFunction<ElementRef<typeof AvatarPrimitive.Image>, AvatarImageProps> = ({
  className,
  children,
  ...props
}, ref) => {
  return (
    <AvatarPrimitive.Image
      {...props}
      ref={ref}
      className={clsx(styles.image, className)}
    >
      {children}
    </AvatarPrimitive.Image>
  );
};

export const AvatarImage = forwardRef(AvatarImageRender);
