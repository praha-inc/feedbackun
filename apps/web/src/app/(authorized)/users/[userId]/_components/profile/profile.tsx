import { Suspense } from 'react';

import { graphql } from '../../../../../../../.graphql';
import { UserProfileCard } from '../../../../../../components/domains/users/user-profile-card';
import { graphqlExecutor } from '../../../../../../graphql';

import type { FC } from 'react';

const UserDetailsProfileQuery = graphql(/* GraphQL */ `
  query UserDetailsProfile($userId: ID!) {
    userById(userId: $userId) {
      ...UserProfileCard
    }
  }
`);

export type UserDetailsProfileProps = {
  userId: string;
};

const UserDetailsProfileInner: FC<UserDetailsProfileProps> = async ({
  userId,
}) => {
  const data = await graphqlExecutor({
    document: UserDetailsProfileQuery,
    variables: { userId },
  });

  return (
    <UserProfileCard fragment={data.userById} />
  );
};

export const UserDetailsProfile: FC<UserDetailsProfileProps> = (props) => {
  return (
    <Suspense fallback={<UserProfileCard fragment={undefined} />}>
      <UserDetailsProfileInner {...props} />
    </Suspense>
  );
};
