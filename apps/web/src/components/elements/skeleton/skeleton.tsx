import { clsx } from 'clsx';
import { forwardRef } from 'react';

import * as styles from './skeleton.css';

import type { RecipeVariants } from '@vanilla-extract/recipes';
import type { ComponentPropsWithoutRef, ForwardRefRenderFunction } from 'react';

type SkeletonVariants = NonNullable<RecipeVariants<typeof styles.wrapper>>;

export type SkeletonRadius = SkeletonVariants['radius'];

export type SkeletonProps = ComponentPropsWithoutRef<'div'> & {
  className?: string | undefined;
  width?: string | undefined;
  height?: string | undefined;
  radius?: SkeletonRadius | undefined;
};

const SkeletonRender: ForwardRefRenderFunction<HTMLDivElement, SkeletonProps> = ({
  className,
  width = '1em',
  height = '1em',
  radius = 'normal',
  ...props
}, ref) => {
  return (
    <div
      {...props}
      ref={ref}
      className={clsx(styles.wrapper({ radius }), className)}
      style={{ width, height }}
    />
  );
};

export const Skeleton = forwardRef(SkeletonRender);
