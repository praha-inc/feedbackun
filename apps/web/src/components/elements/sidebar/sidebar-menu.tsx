import { Slot } from '@radix-ui/react-slot';
import { clsx } from 'clsx';

import * as styles from './sidebar.css';

import type { FC, ComponentProps } from 'react';

export type SidebarMenuProps = ComponentProps<'ul'> & {
  asChild?: boolean | undefined;
};

export const SidebarMenu: FC<SidebarMenuProps> = ({
  className,
  children,
  asChild,
  ...props
}) => {
  const Wrapper = asChild ? Slot : 'ul';

  return (
    <Wrapper
      {...props}
      className={clsx(styles.menu, className)}
    >
      {children}
    </Wrapper>
  );
};
