import * as styles from './layout.css';
import { graphql } from '../../../.graphql';
import { ApplicationHeader } from '../../components/domains/application/application-header';
import { ApplicationSidebar } from '../../components/domains/application/application-sidebar';
import { graphqlExecutor } from '../../graphql';

import type { FC, ReactNode } from 'react';

const AuthorizedLayoutQuery = graphql(/* GraphQL */ `
  query AuthorizedLayout {
    me {
      ...ApplicationSidebar
    }
  }
`);

export const dynamic = 'force-dynamic';

export type AuthorizedLayoutProps = {
  children: ReactNode;
};

const AuthorizedLayout: FC<AuthorizedLayoutProps> = async ({
  children,
}) => {
  const data = await graphqlExecutor({ document: AuthorizedLayoutQuery });

  return (
    <div className={styles.wrapper}>
      <ApplicationHeader className={styles.header} />
      <ApplicationSidebar className={styles.sidebar} fragment={data.me} />
      <main className={styles.main}>
        {children}
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </main>
    </div>
  );
};

export default AuthorizedLayout;
