import { Suspense } from 'react';

import * as styles from './feedbacks.css';
import { graphql } from '../../../../../../../.graphql';
import { FeedbackCard } from '../../../../../../components/domains/feedbacks/feedback-card';
import { InfiniteScroll } from '../../../../../../components/elements/infinite-scroll';
import { graphqlExecutor } from '../../../../../../graphql';

import type { InfiniteScrollFetcher } from '../../../../../../components/elements/infinite-scroll';
import type { FC } from 'react';

const limit = 10;

const UserDetailsFeedbacksQuery = graphql(/* GraphQL */ `
  query UserDetailsFeedbacks(
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

export type UserDetailsFeedbacksProps = {
  userId: string;
  tab: string;
};

const UserDetailsFeedbacksInner: FC<UserDetailsFeedbacksProps> = async ({
  userId,
  tab,
}) => {
  const sent = tab === 'sent';

  const data = await graphqlExecutor({
    document: UserDetailsFeedbacksQuery,
    variables: { userId, limit, sent },
  });
  const edges = sent ? data.userById.sentFeedbacks!.edges : data.userById.receivedFeedbacks!.edges;

  const fetcher: InfiniteScrollFetcher = async ({ cursor }) => {
    'use server';
    const data = await graphqlExecutor({
      document: UserDetailsFeedbacksQuery,
      variables: { userId, limit, sent, cursor },
    });

    const edges = sent ? data.userById.sentFeedbacks!.edges : data.userById.receivedFeedbacks!.edges;
    return edges.map((edge) => ({
      cursor: edge.cursor,
      node: <FeedbackCard key={edge.node.id} fragment={edge.node} />,
    }));
  };

  return (
    <InfiniteScroll
      className={styles.wrapper}
      edges={edges.map((edge) => ({
        cursor: edge.cursor,
        node: <FeedbackCard key={edge.node.id} fragment={edge.node} />,
      }))}
      fetcher={fetcher}
    />
  );
};

export const UserDetailsFeedbacks: FC<UserDetailsFeedbacksProps> = (props) => {
  return (
    <Suspense
      key={props.tab}
      fallback={(
        <div className={styles.wrapper}>
          {Array.from({ length: 5 }).map((_, index) => (
            <FeedbackCard key={index} fragment={undefined} />
          ))}
        </div>
      )}
    >
      <UserDetailsFeedbacksInner {...props} />
    </Suspense>
  );
};
