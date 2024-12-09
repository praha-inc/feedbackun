import { UserDetailsFeedbacks } from './_components/feedbacks';

import type { FC } from 'react';

export type UserDetailsPageProps = {
  params: {
    userId: string;
  };
  searchParams: {
    tab: string | undefined;
  };
};

const UserDetailsPage: FC<UserDetailsPageProps> = ({
  params,
  searchParams,
}) => {
  return (
    <UserDetailsFeedbacks
      userId={params.userId}
      tab={searchParams.tab || 'received'}
    />
  );
};

export default UserDetailsPage;
