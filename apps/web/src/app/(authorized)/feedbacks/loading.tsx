import * as styles from './page.css';
import { FeedbackCard } from '../../../components/domains/feedbacks/feedback-card';

import type { FC } from 'react';

export type FeedbacksLoadingPageProps = {
  //
};

const FeedbacksLoadingPage: FC<FeedbacksLoadingPageProps> = () => {
  return (
    <div className={styles.wrapper}>
      {Array.from({ length: 5 }).map((_, index) => (
        <FeedbackCard key={index} fragment={undefined} />
      ))}
    </div>
  );
};

export default FeedbacksLoadingPage;
