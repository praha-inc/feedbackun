import * as styles from './layout.css';

import type { FC, ReactNode } from 'react';

export type UserDetailsLayoutProps = {
  profile: ReactNode;
  feedbacks: ReactNode;
};

const UserDetailsLayout: FC<UserDetailsLayoutProps> = ({
  profile,
  feedbacks,
}) => {
  return (
    <div className={styles.wrapper}>
      {profile}
      {feedbacks}
    </div>
  );
};

export default UserDetailsLayout;
