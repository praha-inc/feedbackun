import * as styles from './page.css';
import { FeedbackCard } from '../../../../../components/domains/feedbacks/feedback-card';

import type { FC } from 'react';

export type UserDetailsFeedbacksLoadingPageProps = {
  //
};

const UserDetailsFeedbacksLoadingPage: FC<UserDetailsFeedbacksLoadingPageProps> = () => {
  return (
    <div className={styles.wrapper}>
      {Array.from({ length: 5 }).map((_, index) => (
        <FeedbackCard key={index} fragment={undefined} />
      ))}
    </div>
  );
};

export default UserDetailsFeedbacksLoadingPage;
