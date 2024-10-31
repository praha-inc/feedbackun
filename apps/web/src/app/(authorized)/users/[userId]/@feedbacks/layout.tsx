import { UserFeedbackListTabs } from '../../../../../components/domains/users/user-feedback-list-tabs';

import type { FC, ReactNode } from 'react';

export type UserDetailsLayoutProps = {
  children: ReactNode;
};

const UserDetailsLayout: FC<UserDetailsLayoutProps> = ({
  children,
}) => {
  return (
    <UserFeedbackListTabs>
      {children}
    </UserFeedbackListTabs>
  );
};

export default UserDetailsLayout;
