'use client';

import { PanelLeft } from 'lucide-react';
import { forwardRef, useCallback, useMemo } from 'react';

import { useSidebar } from './sidebar-provider';
import { AccessibleIcon } from '../accessible-icon';
import { Button, ButtonIcon } from '../button';

import type { ComponentPropsWithoutRef, ForwardRefRenderFunction, ElementRef, MouseEventHandler } from 'react';

export type SidebarTriggerProps = ComponentPropsWithoutRef<typeof Button>;

const SidebarTriggerRender: ForwardRefRenderFunction<ElementRef<typeof Button>, SidebarTriggerProps> = ({
  className,
  onClick,
  ...props
}, ref) => {
  const { open, expand, shouldUseSheet, toggleOpen, toggleExpand } = useSidebar();

  const label = useMemo(() => {
    return shouldUseSheet
      ? (open ? 'サイドバーを閉じる' : 'サイドバーを開く')
      : (expand ? 'サイドバーを閉じる' : 'サイドバーを開く');
  }, [expand, open, shouldUseSheet]);

  const handleClick = useCallback<MouseEventHandler<ElementRef<typeof Button>>>((event) => {
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
      ref={ref}
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

export const SidebarTrigger = forwardRef(SidebarTriggerRender);
