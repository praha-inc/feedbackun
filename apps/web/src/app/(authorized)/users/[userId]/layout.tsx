import * as styles from './layout.css';

import type { FC, ReactNode } from 'react';

export type UserDetailsLayoutProps = {
  children: ReactNode;
  feedbacks: ReactNode;
};

const UserDetailsLayout: FC<UserDetailsLayoutProps> = ({
  children,
  feedbacks,
}) => {
  return (
    <div className={styles.wrapper}>
      {children}
      {feedbacks}
    </div>
  );
};

export default UserDetailsLayout;
