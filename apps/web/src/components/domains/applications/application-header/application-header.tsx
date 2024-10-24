import { clsx } from 'clsx';

import * as styles from './application-header.css';

import type { FC } from 'react';

export type ApplicationHeaderProps = {
  className?: string | undefined;
};

export const ApplicationHeader: FC<ApplicationHeaderProps> = ({
  className,
}) => {
  return (
    <header className={clsx(styles.wrapper, className)}>
      <h1 className={styles.title}>Feedbackun</h1>
    </header>
  );
};
