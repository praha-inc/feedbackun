import * as styles from './layout.css';
import { ApplicationHeader } from '../../components/domains/application/application-header';
import { ApplicationSidebar } from '../../components/domains/application/application-sidebar';

import type { FC, ReactNode } from 'react';

export type AuthorizedLayoutProps = {
  children: ReactNode;
};

const AuthorizedLayout: FC<AuthorizedLayoutProps> = ({
  children,
}) => {
  return (
    <div className={styles.wrapper}>
      <ApplicationHeader className={styles.header} />
      <ApplicationSidebar className={styles.sidebar} />
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
};

export default AuthorizedLayout;
