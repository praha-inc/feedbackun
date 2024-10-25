import * as styles from './feedback-card.css';
import { graphql, useFragment } from '../../../../../.graphql';
import { UserIcon } from '../../users/user-icon';

import type { FragmentType } from '../../../../../.graphql';
import type { FC } from 'react';

export const FeedbackCardFragment = graphql(/* GraphQL */ `
  fragment FeedbackCard on Feedback{
    id
    content
    createdAt
    recipient {
      id
      type
      name
      ...UserIcon
    }
    sender {
      id
      name
    }
    slackMessage {
      id
      content
      slackChannel {
        id
        name
      }
    }
  }
`);

export type FeedbackCardProps = {
  fragment: FragmentType<typeof FeedbackCardFragment>;
};

export const FeedbackCard: FC<FeedbackCardProps> = ({
  fragment,
}) => {
  const data = useFragment(FeedbackCardFragment, fragment);

  return (
    <article className={styles.wrapper}>
      {/** TODO: ユーザープロフィールに遷移するようにする */}
      <header className={styles.header}>
        <UserIcon className={styles.userIcon} fragment={data.recipient}/>
        <div className={styles.user}>
          <span className={styles.userName}>
            {data.recipient.name}
          </span>
          <span className={styles.userType}>
            {data.recipient.type}
          </span>
        </div>
      </header>
      <div className={styles.supplemental}>
        <span className={styles.channel}>
          チャンネル: #{data.slackMessage.slackChannel.name}
        </span>
      </div>
      <div className={styles.message}>
        <p className={styles.lineClamp}>
          {data.slackMessage.content}
        </p>
      </div>
      {data.content && (
        <div className={styles.comment}>
          <p className={styles.lineClamp}>
            {data.content}
          </p>
        </div>
      )}
      <footer className={styles.footer}>
        <span>
          送信者: {data.sender.name}
        </span>
        <time dateTime={data.createdAt}>
          {new Date(data.createdAt).toLocaleString()}
        </time>
      </footer>
    </article>
  );
};
