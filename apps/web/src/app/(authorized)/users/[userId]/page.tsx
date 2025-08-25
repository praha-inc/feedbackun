import { UserDetailsFeedbacks } from './_components/feedbacks';

import type { FC } from 'react';

export type UserDetailsPageProps = PageProps<'/users/[userId]'>;

const UserDetailsPage: FC<UserDetailsPageProps> = async ({
  params,
  searchParams,
}) => {
  const { userId } = await params;
  const { tab } = await searchParams;

  return (
    <UserDetailsFeedbacks
      userId={userId}
      tab={tab?.toString() || 'received'}
    />
  );
};

export default UserDetailsPage;
