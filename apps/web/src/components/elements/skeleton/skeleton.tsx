import { clsx } from 'clsx';

import * as styles from './skeleton.css';

import type { RecipeVariants } from '@vanilla-extract/recipes';
import type { FC } from 'react';

type SkeletonVariants = NonNullable<RecipeVariants<typeof styles.wrapper>>;

export type SkeletonRadius = SkeletonVariants['radius'];

export type SkeletonProps = {
  className?: string | undefined;
  width?: string | undefined;
  height?: string | undefined;
  radius?: SkeletonRadius | undefined;
};

export const Skeleton: FC<SkeletonProps> = ({
  className,
  width = '1em',
  height = '1em',
  radius = 'normal',
}) => {
  return (
    <div className={clsx(styles.wrapper({ radius }), className)} style={{ width, height }} />
  );
};
