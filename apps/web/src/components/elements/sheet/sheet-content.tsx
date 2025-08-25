'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import { clsx } from 'clsx';

import * as styles from './sheet.css';

import type { RecipeVariants } from '@vanilla-extract/recipes';
import type { FC, ComponentProps } from 'react';

type SheetContentVariants = NonNullable<RecipeVariants<typeof styles.content>>;

export type SheetContentSide = Exclude<SheetContentVariants['side'], undefined>;

export type SheetContentProps = ComponentProps<typeof DialogPrimitive.Content> & {
  side?: SheetContentSide | undefined;
};

export const SheetContent: FC<SheetContentProps> = ({
  className,
  children,
  side = 'left',
  ...props
}) => {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className={styles.overlay} />
      <DialogPrimitive.Content
        {...props}
        className={clsx(styles.content({ side }), className)}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
};
