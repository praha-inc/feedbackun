'use client';

import { Slot } from '@radix-ui/react-slot';
import { clsx } from 'clsx';

import { useSidebar } from './sidebar-provider';
import * as styles from './sidebar.css';
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip';

import type { RecipeVariants } from '@vanilla-extract/recipes';
import type { FC, ComponentProps, ReactNode } from 'react';

type SidebarMenuButtonVariants = NonNullable<RecipeVariants<typeof styles.menuButton>>;

export type SidebarMenuButtonSize = Exclude<SidebarMenuButtonVariants['size'], undefined>;

export type SidebarMenuButtonProps = ComponentProps<'button'> & {
  size?: SidebarMenuButtonSize | undefined;
  tooltip?: ReactNode | undefined;
  asChild?: boolean | undefined;
};

export const SidebarMenuButton: FC<SidebarMenuButtonProps> = ({
  className,
  children,
  size = 'normal',
  tooltip,
  asChild,
  ...props
}) => {
  const { expand, shouldUseSheet } = useSidebar();
  const Wrapper = asChild ? Slot : 'button';

  const child = (
    <Wrapper
      {...props}
      className={clsx(styles.menuButton({ size }), className)}
    >
      {children}
    </Wrapper>
  );

  if (!expand && !shouldUseSheet && tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger>{child}</TooltipTrigger>
        <TooltipContent
          side="right"
          align="center"
        >
          {tooltip}
        </TooltipContent>
      </Tooltip>
    );
  }

  return child;
};
