import type { FC } from 'react';

export type UserDetailsReceivedFeedbacksPageProps = {
  params: {
    userId: string;
  };
  searchParams: {
    tab: string | undefined;
  };
};

const UserDetailsReceivedFeedbacksPage: FC<UserDetailsReceivedFeedbacksPageProps> = () => {
  return null;
};

export default UserDetailsReceivedFeedbacksPage;
