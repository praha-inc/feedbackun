import { clsx } from 'clsx';
import { Slot as SlotPrimitive } from 'radix-ui';

import * as styles from './sidebar.css';

import type { FC, ComponentProps } from 'react';

export type SidebarHeaderProps = ComponentProps<'div'> & {
  asChild?: boolean | undefined;
};

export const SidebarHeader: FC<SidebarHeaderProps> = ({
  className,
  children,
  asChild,
  ...props
}) => {
  const Wrapper = asChild ? SlotPrimitive.Slot : 'div';

  return (
    <Wrapper
      {...props}
      className={clsx(styles.header, className)}
    >
      {children}
    </Wrapper>
  );
};
