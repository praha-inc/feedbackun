import { graphql } from '../../../../../.graphql';
import { UserProfileCard } from '../../../../components/domains/users/user-profile-card';
import { graphqlExecutor } from '../../../../graphql';

import type { FC } from 'react';

const UserDetailsPageQuery = graphql(/* GraphQL */ `
  query UserDetailsPage($userId: ID!) {
    userById(userId: $userId) {
      ...UserProfileCard
    }
  }
`);

export type UserDetailsPageProps = {
  params: {
    userId: string;
  };
};

const UserDetailsPage: FC<UserDetailsPageProps> = async ({
  params,
}) => {
  const data = await graphqlExecutor({
    document: UserDetailsPageQuery,
    variables: { userId: params.userId },
  });

  return (
    <UserProfileCard fragment={data.userById} />
  );
};

export default UserDetailsPage;
