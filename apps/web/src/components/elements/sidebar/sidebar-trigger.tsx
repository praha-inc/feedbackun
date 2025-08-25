'use client';

import { PanelLeft } from 'lucide-react';
import { useCallback, useMemo } from 'react';

import { useSidebar } from './sidebar-provider';
import { AccessibleIcon } from '../accessible-icon';
import { Button, ButtonIcon } from '../button';

import type { ComponentProps, ComponentRef, MouseEventHandler, FC } from 'react';

export type SidebarTriggerProps = ComponentProps<typeof Button>;

export const SidebarTrigger: FC<SidebarTriggerProps> = ({
  className,
  onClick,
  ...props
}) => {
  const { open, expand, shouldUseSheet, toggleOpen, toggleExpand } = useSidebar();

  const label = useMemo(() => {
    return shouldUseSheet
      ? (open ? 'サイドバーを閉じる' : 'サイドバーを開く')
      : (expand ? 'サイドバーを閉じる' : 'サイドバーを開く');
  }, [expand, open, shouldUseSheet]);

  const handleClick = useCallback<MouseEventHandler<ComponentRef<typeof Button>>>((event) => {
    if (shouldUseSheet) {
      toggleOpen();
    } else {
      toggleExpand();
    }

    onClick?.(event);
  }, [onClick, shouldUseSheet, toggleExpand, toggleOpen]);

  return (
    <Button
      {...props}
      className={className}
      variant="ghost"
      size="icon"
      onClick={handleClick}
    >
      <ButtonIcon>
        <AccessibleIcon label={label}>
          <PanelLeft />
        </AccessibleIcon>
      </ButtonIcon>
    </Button>
  );
};
