import { clsx } from 'clsx';

import * as styles from './sidebar.css';

import type { FC, ComponentProps } from 'react';

export type SidebarMenuButtonIconProps = ComponentProps<'div'>;

export const SidebarMenuButtonIcon: FC<SidebarMenuButtonIconProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      {...props}
      className={clsx(styles.menuButtonIcon, className)}
    >
      {children}
    </div>
  );
};
