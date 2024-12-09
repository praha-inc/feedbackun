import { Suspense } from 'react';

import { graphql } from '../../../../../.graphql';
import { ApplicationSidebar } from '../../../../components/domains/applications/application-sidebar';
import { graphqlExecutor } from '../../../../graphql';

import type { FC } from 'react';

const AuthorizedSidebarQuery = graphql(/* GraphQL */ `
  query AuthorizedSidebar {
    me {
      ...ApplicationSidebar
    }
  }
`);

export type AuthorizedSidebarProps = {
  //
};

const AuthorizedSidebarInner: FC<AuthorizedSidebarProps> = async () => {
  const data = await graphqlExecutor({ document: AuthorizedSidebarQuery });

  return (
    <ApplicationSidebar
      fragment={data.me}
    />
  );
};

export const AuthorizedSidebar: FC<AuthorizedSidebarProps> = () => {
  return (
    <Suspense fallback={<ApplicationSidebar fragment={undefined} />}>
      <AuthorizedSidebarInner />
    </Suspense>
  );
};
