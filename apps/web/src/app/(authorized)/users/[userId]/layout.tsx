import { UserDetailsProfile } from './_components/profile';
import * as styles from './layout.css';
import { UserFeedbackListTabs } from '../../../../components/domains/users/user-feedback-list-tabs';

import type { FC } from 'react';

export type UserDetailsPageProps = LayoutProps<'/users/[userId]'>;

const UserDetailsPage: FC<UserDetailsPageProps> = async ({
  params,
  children,
}) => {
  const { userId } = await params;

  return (
    <div className={styles.wrapper}>
      <UserDetailsProfile userId={userId} />
      <UserFeedbackListTabs>
        {children}
      </UserFeedbackListTabs>
    </div>
  );
};

export default UserDetailsPage;
