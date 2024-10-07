import * as styles from './layout.css';
import { graphql } from '../../../.graphql';
import { ApplicationHeader } from '../../components/domains/application/application-header';
import { ApplicationSidebar } from '../../components/domains/application/application-sidebar';
import { graphqlExecutor } from '../../graphql';

import type { FC, ReactNode } from 'react';

const AuthorizedLayoutQuery = graphql(/* GraphQL */ `
  query AuthorizedLayout {
    me {
      id
      name
      icon
    }
  }
`);

export type AuthorizedLayoutProps = {
  children: ReactNode;
};

const AuthorizedLayout: FC<AuthorizedLayoutProps> = async ({
  children,
}) => {
  const result = await graphqlExecutor({ document: AuthorizedLayoutQuery });

  return (
    <div className={styles.wrapper}>
      <ApplicationHeader className={styles.header} />
      <ApplicationSidebar className={styles.sidebar} />
      <main className={styles.main}>
        {children}
        <pre>{JSON.stringify(result, null, 2)}</pre>
      </main>
    </div>
  );
};

export default AuthorizedLayout;
