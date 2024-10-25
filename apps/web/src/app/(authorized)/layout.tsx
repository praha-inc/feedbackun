import * as styles from './layout.css';
import { ApplicationHeader } from '../../components/domains/applications/application-header';
import { ScrollArea, ScrollAreaViewport } from '../../components/elements/scroll-area';

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
      <ScrollArea asChild>
        <main className={styles.main}>
          <ScrollAreaViewport vertical>
            <div className={styles.container}>
              {children}
            </div>
          </ScrollAreaViewport>
        </main>
      </ScrollArea>
    </div>
  );
};

export default AuthorizedLayout;
