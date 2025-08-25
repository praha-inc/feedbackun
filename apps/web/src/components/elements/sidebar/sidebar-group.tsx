import { Slot } from '@radix-ui/react-slot';
import { clsx } from 'clsx';

import * as styles from './sidebar.css';

import type { FC, ComponentProps } from 'react';

export type SidebarGroupProps = ComponentProps<'div'> & {
  asChild?: boolean | undefined;
};

export const SidebarGroup: FC<SidebarGroupProps> = ({
  className,
  children,
  asChild,
  ...props
}) => {
  const Wrapper = asChild ? Slot : 'div';

  return (
    <Wrapper
      {...props}
      className={clsx(styles.group, className)}
    >
      {children}
    </Wrapper>
  );
};
