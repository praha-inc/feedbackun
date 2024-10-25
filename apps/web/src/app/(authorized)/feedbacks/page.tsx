import * as styles from './page.css';
import { graphql } from '../../../../.graphql';
import { FeedbackCard } from '../../../components/domains/feedbacks/feedback-card';
import { InfiniteScroll } from '../../../components/elements/infinite-scroll';
import { graphqlExecutor } from '../../../graphql';

import type { InfiniteScrollFetcher } from '../../../components/elements/infinite-scroll';
import type { FC } from 'react';

const limit = 10;

const FeedbacksPageQuery = graphql(/* GraphQL */ `
  query FeedbacksPage($limit: Int!, $cursor: String) {
    feedbacks(first: $limit, after: $cursor) {
      totalCount
      edges {
        cursor
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
  const data = await graphqlExecutor({
    document: FeedbacksPageQuery,
    variables: { limit },
  });

  const fetcher: InfiniteScrollFetcher = async ({ cursor }) => {
    'use server';
    const data = await graphqlExecutor({
      document: FeedbacksPageQuery,
      variables: { limit, cursor },
    });

    return data.feedbacks.edges.map((edge) => ({
      cursor: edge.cursor,
      node: <FeedbackCard key={edge.node.id} fragment={edge.node} />,
    }));
  };

  return (
    <InfiniteScroll
      className={styles.wrapper}
      edges={data.feedbacks.edges.map((edge) => ({
        cursor: edge.cursor,
        node: <FeedbackCard key={edge.node.id} fragment={edge.node} />,
      }))}
      fetcher={fetcher}
    />
  );
};

export default FeedbacksPage;
