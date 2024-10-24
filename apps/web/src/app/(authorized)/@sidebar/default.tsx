import * as styles from './default.css';
import { graphql } from '../../../../.graphql';
import { ApplicationSidebar } from '../../../components/domains/application/application-sidebar';
import { graphqlExecutor } from '../../../graphql';

import type { FC } from 'react';

export const AuthorizedSidebarQuery = graphql(/* GraphQL */ `
  query AuthorizedSidebar {
    me {
      ...ApplicationSidebar
    }
  }
`);

export const dynamic = 'force-dynamic';

export type AuthorizedSidebarProps = {
  //
};

const AuthorizedSidebar: FC<AuthorizedSidebarProps> = async () => {
  const data = await graphqlExecutor({ document: AuthorizedSidebarQuery });

  return (
    <ApplicationSidebar
      className={styles.sidebar}
      fragment={data.me}
    />
  );
};

export default AuthorizedSidebar;
