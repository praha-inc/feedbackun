import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import { clsx } from 'clsx';

import * as styles from './scroll-area.css';

import type { FC, ComponentProps } from 'react';

export type ScrollAreaBarProps = ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>;

export const ScrollAreaBar: FC<ScrollAreaBarProps> = ({
  className,
  ...props
}) => {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      {...props}
      className={clsx(styles.bar({ orientation: props.orientation }), className)}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb className={styles.thumb} />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
};
