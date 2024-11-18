import { clsx } from 'clsx';

import * as styles from './application-header.css';
import { SidebarTrigger } from '../../../elements/sidebar';

import type { FC } from 'react';

export type ApplicationHeaderProps = {
  className?: string | undefined;
};

export const ApplicationHeader: FC<ApplicationHeaderProps> = ({
  className,
}) => {
  return (
    <header className={clsx(styles.wrapper, className)}>
      <SidebarTrigger />
    </header>
  );
};
