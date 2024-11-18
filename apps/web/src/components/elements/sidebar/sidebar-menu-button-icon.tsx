import { clsx } from 'clsx';
import { forwardRef } from 'react';

import * as styles from './sidebar.css';

import type { ComponentPropsWithoutRef, ForwardRefRenderFunction, ElementRef } from 'react';

export type SidebarMenuButtonIconProps = ComponentPropsWithoutRef<'div'>

const SidebarMenuButtonIconRender: ForwardRefRenderFunction<ElementRef<'div'>, SidebarMenuButtonIconProps> = ({
  className,
  children,
  ...props
}, ref) => {
  return (
    <div
      {...props}
      ref={ref}
      className={clsx(styles.menuButtonIcon, className)}
    >
      {children}
    </div>
  );
};

export const SidebarMenuButtonIcon = forwardRef(SidebarMenuButtonIconRender);
