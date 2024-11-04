import { graphql } from '../../../../../../.graphql';
import { UserProfileCard } from '../../../../../components/domains/users/user-profile-card';
import { graphqlExecutor } from '../../../../../graphql';

import type { FC } from 'react';

const UserDetailsProfilePageQuery = graphql(/* GraphQL */ `
  query UserDetailsProfilePage($userId: ID!) {
    userById(userId: $userId) {
      ...UserProfileCard
    }
  }
`);

export type UserDetailsProfilePageProps = {
  params: {
    userId: string;
  };
};

const UserDetailsProfilePage: FC<UserDetailsProfilePageProps> = async ({
  params,
}) => {
  const data = await graphqlExecutor({
    document: UserDetailsProfilePageQuery,
    variables: { userId: params.userId },
  });

  return (
    <UserProfileCard fragment={data.userById} />
  );
};

export default UserDetailsProfilePage;
