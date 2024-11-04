import { UserProfileCard } from '../../../../../components/domains/users/user-profile-card';

import type { FC } from 'react';

export type UserDetailsProfileLoadingPageProps = {
  //
};

const UserDetailsProfileLoadingPage: FC<UserDetailsProfileLoadingPageProps> = () => {
  return (
    <UserProfileCard fragment={undefined} />
  );
};

export default UserDetailsProfileLoadingPage;
