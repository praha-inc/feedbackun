import * as styles from './page.css';
import { graphql } from '../../../../.graphql';
import { FeedbackCard } from '../../../components/domains/feedbacks/feedback-card';
import { graphqlExecutor } from '../../../graphql';

import type { FC } from 'react';

const FeedbacksPageQuery = graphql(/* GraphQL */ `
  query FeedbacksPage {
    feedbacks {
      edges {
        node {
          id
          ...FeedbackCard
        }
      }
    }
  }
`);

export type FeedbacksPageProps = {
  //
};

const FeedbacksPage: FC<FeedbacksPageProps> = async () => {
  const data = await graphqlExecutor({ document: FeedbacksPageQuery });

  return (
    <div className={styles.wrapper}>
      {data.feedbacks.edges.map((edge) => (
        <FeedbackCard key={edge.node.id} fragment={edge.node} />
      ))}
    </div>
  );
};

export default FeedbacksPage;
