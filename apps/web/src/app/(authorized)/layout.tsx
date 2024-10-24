import * as styles from './layout.css';
import { ApplicationHeader } from '../../components/domains/applications/application-header';

import type { FC, ReactNode } from 'react';

export type AuthorizedLayoutProps = {
  children: ReactNode;
  sidebar: ReactNode;
};

const AuthorizedLayout: FC<AuthorizedLayoutProps> = ({
  children,
  sidebar,
}) => {
  return (
    <div className={styles.wrapper}>
      <ApplicationHeader className={styles.header} />
      {sidebar}
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
};

export default AuthorizedLayout;
