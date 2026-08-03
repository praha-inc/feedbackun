import { clsx } from 'clsx';
import { Slot as SlotPrimitive } from 'radix-ui';

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
  const Wrapper = asChild ? SlotPrimitive.Slot : 'ul';

  return (
    <Wrapper
      {...props}
      className={clsx(styles.menu, className)}
    >
      {children}
    </Wrapper>
  );
};
