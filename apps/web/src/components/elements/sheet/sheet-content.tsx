'use client';

import { AccessibleIcon } from '@radix-ui/react-accessible-icon';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { clsx } from 'clsx';
import { XIcon } from 'lucide-react';
import { forwardRef } from 'react';

import * as styles from './sheet.css';
import { Button, ButtonIcon } from '../button';

import type { RecipeVariants } from '@vanilla-extract/recipes';
import type { ElementRef, ComponentPropsWithoutRef, ForwardRefRenderFunction } from 'react';

type SheetContentVariants = NonNullable<RecipeVariants<typeof styles.content>>;

export type SheetContentSide = Exclude<SheetContentVariants['side'], undefined>;

export type SheetContentProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
  side?: SheetContentSide | undefined;
};

const SheetContentRender: ForwardRefRenderFunction<ElementRef<typeof DialogPrimitive.Content>, SheetContentProps> = ({
  className,
  children,
  side = 'left',
  ...props
}, ref) => {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className={styles.overlay} />
      <DialogPrimitive.Content
        {...props}
        ref={ref}
        className={clsx(styles.content({ side }), className)}
      >
        {children}
        <DialogPrimitive.Close asChild>
          <Button className={styles.close} variant="ghost" size="icon" borderless>
            <ButtonIcon>
              <AccessibleIcon label="閉じる">
                <XIcon />
              </AccessibleIcon>
            </ButtonIcon>
          </Button>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
};

export const SheetContent = forwardRef(SheetContentRender);
