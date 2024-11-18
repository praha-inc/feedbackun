'use client';

import { clsx } from 'clsx';
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import * as styles from './sidebar.css';
import { useMediaQuery } from '../../../hooks/use-media-query';
import { Sheet } from '../sheet';

import type { ForwardRefRenderFunction, ReactNode, ElementRef, ComponentPropsWithoutRef } from 'react';

export type SidebarContext = {
  open: boolean;
  expand: boolean;
  shouldUseSheet: boolean;
  toggleOpen: () => void;
  toggleExpand: () => void;
};

const SidebarContext = createContext<SidebarContext | null>(null);

export const useSidebar = (): SidebarContext => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

export type SidebarProviderProps = ComponentPropsWithoutRef<'div'> & {
  children: ReactNode;
  defaultExpand?: boolean;
};

const SidebarProviderRender: ForwardRefRenderFunction<ElementRef<'div'>, SidebarProviderProps> = ({
  className,
  children,
  defaultExpand = true,
  ...props
}, ref) => {
  const [open, setOpen] = useState(false);
  const [expand, setExpand] = useState(defaultExpand);
  const shouldUseSheet = useMediaQuery(`(width < ${styles.breakpoint})`);

  const toggleOpen = useCallback(() => {
    setOpen((previous) => !previous);
  }, []);

  const toggleExpand = useCallback(() => {
    setExpand((previous) => !previous);
  }, []);

  const contextValue = useMemo<SidebarContext>(
    () => ({
      open,
      expand,
      shouldUseSheet,
      toggleOpen,
      toggleExpand,
    }),
    [expand, open, shouldUseSheet, toggleExpand, toggleOpen],
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <Sheet open={open} onOpenChange={setOpen}>
        <div {...props} ref={ref} className={clsx(styles.wrapper, className)}>
          {children}
        </div>
      </Sheet>
    </SidebarContext.Provider>
  );
};

export const SidebarProvider = forwardRef(SidebarProviderRender);
