import * as styles from './page.css';
import { graphql } from '../../../../../../.graphql';
import { FeedbackCard } from '../../../../../components/domains/feedbacks/feedback-card';
import { InfiniteScroll } from '../../../../../components/elements/infinite-scroll';
import { graphqlExecutor } from '../../../../../graphql';

import type { InfiniteScrollFetcher } from '../../../../../components/elements/infinite-scroll';
import type { FC } from 'react';

const limit = 10;

const UserDetailsFeedbacksPageReceivedQuery = graphql(/* GraphQL */ `
  query UserDetailsFeedbacksPageReceived($userId: ID!, $limit: Int!, $cursor: String) {
    userById(userId: $userId) {
      receivedFeedbacks(first: $limit, after: $cursor) {
        edges {
          cursor
          node {
            id
            ...FeedbackCard
          }
        }
      }
    }
  }
`);

export type UserDetailsFeedbacksPageProps = {
  params: {
    userId: string;
  };
  searchParams: {
    tab: string | undefined;
  };
};

const UserDetailsFeedbacksPage: FC<UserDetailsFeedbacksPageProps> = async ({
  params,
  searchParams,
}) => {
  if (searchParams.tab === 'sent') {
    return null;
  }

  const data = await graphqlExecutor({
    document: UserDetailsFeedbacksPageReceivedQuery,
    variables: { userId: params.userId, limit },
  });

  const fetcher: InfiniteScrollFetcher = async ({ cursor }) => {
    'use server';
    const data = await graphqlExecutor({
      document: UserDetailsFeedbacksPageReceivedQuery,
      variables: { userId: params.userId, limit, cursor },
    });

    return data.userById.receivedFeedbacks.edges.map((edge) => ({
      cursor: edge.cursor,
      node: <FeedbackCard key={edge.node.id} fragment={edge.node} />,
    }));
  };

  return (
    <InfiniteScroll
      className={styles.wrapper}
      edges={data.userById.receivedFeedbacks.edges.map((edge) => ({
        cursor: edge.cursor,
        node: <FeedbackCard key={edge.node.id} fragment={edge.node} />,
      }))}
      fetcher={fetcher}
    />
  );
};

export default UserDetailsFeedbacksPage;
