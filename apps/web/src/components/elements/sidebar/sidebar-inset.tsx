import { Slot } from '@radix-ui/react-slot';
import { clsx } from 'clsx';

import * as styles from './sidebar.css';

import type { FC, ComponentProps } from 'react';

export type SidebarInsetProps = ComponentProps<'div'> & {
  asChild?: boolean | undefined;
};

export const SidebarInset: FC<SidebarInsetProps> = ({
  className,
  children,
  asChild,
  ...props
}) => {
  const Wrapper = asChild ? Slot : 'div';

  return (
    <Wrapper
      {...props}
      className={clsx(styles.inset, className)}
    >
      {children}
    </Wrapper>
  );
};
