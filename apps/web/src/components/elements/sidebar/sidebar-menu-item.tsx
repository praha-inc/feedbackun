import { Slot } from '@radix-ui/react-slot';
import { clsx } from 'clsx';

import * as styles from './sidebar.css';

import type { FC, ComponentProps } from 'react';

export type SidebarMenuItemProps = ComponentProps<'li'> & {
  asChild?: boolean | undefined;
};

export const SidebarMenuItem: FC<SidebarMenuItemProps> = ({
  className,
  children,
  asChild,
  ...props
}) => {
  const Wrapper = asChild ? Slot : 'li';

  return (
    <Wrapper
      {...props}
      className={clsx(styles.menuItem, className)}
    >
      {children}
    </Wrapper>
  );
};
