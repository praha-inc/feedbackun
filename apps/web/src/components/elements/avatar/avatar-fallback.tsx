import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { clsx } from 'clsx';
import { forwardRef } from 'react';

import * as styles from './avatar.css';

import type { ForwardRefRenderFunction, ComponentPropsWithoutRef, ElementRef } from 'react';

export type AvatarFallbackProps = ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>;

const AvatarFallbackRender: ForwardRefRenderFunction<ElementRef<typeof AvatarPrimitive.Fallback>, AvatarFallbackProps> = ({
  className,
  children,
  ...props
}, ref) => {
  return (
    <AvatarPrimitive.Fallback
      {...props}
      ref={ref}
      className={clsx(styles.fallback, className)}
    >
      {children}
    </AvatarPrimitive.Fallback>
  );
};

export const AvatarFallback = forwardRef(AvatarFallbackRender);
