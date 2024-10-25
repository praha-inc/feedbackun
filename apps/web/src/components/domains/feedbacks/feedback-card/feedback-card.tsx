import { format } from 'date-fns';
import { ExternalLink } from 'lucide-react';

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
      ...UserIcon
    }
    slackMessage {
      id
      content
      url
      slackChannel {
        id
        name
        slackTeam {
          id
          name
        }
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
        <UserIcon className={styles.recipientIcon} fragment={data.recipient} />
        <div className={styles.recipient}>
          <span className={styles.recipientName}>
            {data.recipient.name}
          </span>
          <span className={styles.recipientType}>
            {data.recipient.type}
          </span>
        </div>
      </header>
      <div className={styles.supplemental}>
        <div className={styles.slack}>
          <span className={styles.team}>
            {data.slackMessage.slackChannel.slackTeam.name}
          </span>
          ・
          <span className={styles.channel}>
            チャンネル: #{data.slackMessage.slackChannel.name}
          </span>
        </div>
        <a
          className={styles.link}
          target="_blank"
          rel="noopener noreferrer"
          href={data.slackMessage.url}
        >
          Slackで開く
          <ExternalLink size="1em" />
        </a>
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
        <div className={styles.sender}>
          <span>送信者: </span>
          <UserIcon className={styles.senderIcon} fragment={data.sender} />
          <span>{data.sender.name}</span>
        </div>
        <time dateTime={data.createdAt}>
          {format(data.createdAt, 'yyyy/MM/dd HH:mm')}
        </time>
      </footer>
    </article>
  );
};
