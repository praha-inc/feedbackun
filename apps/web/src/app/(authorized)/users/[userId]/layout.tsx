import { UserDetailsProfile } from './_components/profile';
import * as styles from './layout.css';
import { UserFeedbackListTabs } from '../../../../components/domains/users/user-feedback-list-tabs';

import type { FC, ReactNode } from 'react';

export type UserDetailsPageProps = {
  params: {
    userId: string;
  };
  children: ReactNode;
};

const UserDetailsPage: FC<UserDetailsPageProps> = ({
  params,
  children,
}) => {
  return (
    <div className={styles.wrapper}>
      <UserDetailsProfile userId={params.userId} />
      <UserFeedbackListTabs>
        {children}
      </UserFeedbackListTabs>
    </div>
  );
};

export default UserDetailsPage;
