import * as styles from './page.css';
import { graphql } from '../../../../../../.graphql';
import { FeedbackCard } from '../../../../../components/domains/feedbacks/feedback-card';
import { InfiniteScroll } from '../../../../../components/elements/infinite-scroll';
import { graphqlExecutor } from '../../../../../graphql';

import type { InfiniteScrollFetcher } from '../../../../../components/elements/infinite-scroll';
import type { FC } from 'react';

const limit = 10;

const UserDetailsFeedbacksPageQuery = graphql(/* GraphQL */ `
  query UserDetailsFeedbacksPage(
    $userId: ID!
    $limit: Int!
    $sent: Boolean!
    $cursor: String
  ) {
    userById(userId: $userId) {
      receivedFeedbacks(first: $limit, after: $cursor) @skip(if: $sent) {
        edges {
          cursor
          node {
            id
            ...FeedbackCard
          }
        }
      }
      sentFeedbacks(first: $limit, after: $cursor) @include(if: $sent) {
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
  const sent = searchParams.tab === 'sent';

  const data = await graphqlExecutor({
    document: UserDetailsFeedbacksPageQuery,
    variables: { userId: params.userId, limit, sent },
  });
  const edges = sent ? data.userById.sentFeedbacks!.edges : data.userById.receivedFeedbacks!.edges;

  const fetcher: InfiniteScrollFetcher = async ({ cursor }) => {
    'use server';
    const data = await graphqlExecutor({
      document: UserDetailsFeedbacksPageQuery,
      variables: { userId: params.userId, limit, sent, cursor },
    });

    const edges = sent ? data.userById.sentFeedbacks!.edges : data.userById.receivedFeedbacks!.edges;
    return edges.map((edge) => ({
      cursor: edge.cursor,
      node: <FeedbackCard key={edge.node.id} fragment={edge.node} />,
    }));
  };

  return (
    <InfiniteScroll
      key={searchParams.tab}
      className={styles.wrapper}
      edges={edges.map((edge) => ({
        cursor: edge.cursor,
        node: <FeedbackCard key={edge.node.id} fragment={edge.node} />,
      }))}
      fetcher={fetcher}
    />
  );
};

export default UserDetailsFeedbacksPage;
