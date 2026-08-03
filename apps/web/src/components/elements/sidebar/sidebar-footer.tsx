import { clsx } from 'clsx';
import { Slot as SlotPrimitive } from 'radix-ui';

import * as styles from './sidebar.css';

import type { FC, ComponentProps } from 'react';

export type SidebarFooterProps = ComponentProps<'div'> & {
  asChild?: boolean | undefined;
};

export const SidebarFooter: FC<SidebarFooterProps> = ({
  className,
  children,
  asChild,
  ...props
}) => {
  const Wrapper = asChild ? SlotPrimitive.Slot : 'div';

  return (
    <Wrapper
      {...props}
      className={clsx(styles.footer, className)}
    >
      {children}
    </Wrapper>
  );
};
