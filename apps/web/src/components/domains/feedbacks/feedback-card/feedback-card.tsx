import { tz } from '@date-fns/tz';
import { format } from 'date-fns';
import Link from 'next/link';

import * as styles from './feedback-card.css';
import { graphql, useFragment } from '../../../../../.graphql';
import { Button } from '../../../elements/button';
import { Skeleton } from '../../../elements/skeleton';
import { SlackMessageLink } from '../../slack/slack-message-link';
import { SlackTeamIcon } from '../../slack/slack-team-icon';
import { UserIcon } from '../../users/user-icon';
import { FeedbackSkillBadge } from '../feedback-skill-badge';

import type { FragmentType } from '../../../../../.graphql';
import type { FC } from 'react';

export const FeedbackCardFragment = graphql(/* GraphQL */ `
  fragment FeedbackCard on Feedback {
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
    assignedSkills {
      ...FeedbackSkillBadge
    }
    slackMessage {
      id
      content
      ...SlackMessageLink
      slackChannel {
        id
        name
        slackTeam {
          id
          name
          ...SlackTeamIcon
        }
      }
    }
  }
`);

export type FeedbackCardProps = {
  fragment: FragmentType<typeof FeedbackCardFragment> | undefined;
};

export const FeedbackCard: FC<FeedbackCardProps> = ({
  fragment,
}) => {
  const data = useFragment(FeedbackCardFragment, fragment);

  return (
    <article className={styles.wrapper}>
      <header>
        <Button variant="ghost" size="medium" borderless asChild>
          <Link className={styles.profile({ disabled: !data })} href={`/users/${data?.recipient.id}`}>
            <UserIcon className={styles.recipientIcon} fragment={data?.recipient} />
            <div className={styles.recipient}>
              <span className={styles.recipientName}>
                {data?.recipient.name ?? <Skeleton width="8em" />}
              </span>
              <span className={styles.recipientType}>
                {data?.recipient.type ?? <Skeleton width="4em" />}
              </span>
            </div>
          </Link>
        </Button>
      </header>
      <div className={styles.supplemental}>
        <div className={styles.slack}>
          <SlackTeamIcon
            className={styles.teamIcon}
            fragment={data?.slackMessage.slackChannel.slackTeam}
          />
          <span className={styles.team}>
            {data?.slackMessage.slackChannel.slackTeam.name ?? <Skeleton width="4em" />}
          </span>
          {data ? '・' : <Skeleton width="1em" />}
          <span className={styles.channel}>
            {data ? `チャンネル: #${data?.slackMessage.slackChannel.name}` : <Skeleton width="8em" />}
          </span>
        </div>
        <SlackMessageLink fragment={data?.slackMessage} />
      </div>
      <div className={styles.messageContainer}>
        {data ? (
          <div className={styles.message}>
            <p className={styles.lineClamp}>
              {data?.slackMessage.content}
            </p>
          </div>
        ) : (
          <Skeleton width="100%" height="3em" />
        )}
      </div>
      {data && 0 < data.assignedSkills.length && (
        <div className={styles.skills}>
          {data.assignedSkills.map((assignedSkill, index) => (
            <FeedbackSkillBadge key={index} fragment={assignedSkill} />
          ))}
        </div>
      )}
      {data?.content && (
        <div className={styles.comment}>
          {/* TODO: フィードバック詳細画面を作ったら styles.lineClamp を当てるようにする */}
          <p style={{ whiteSpace: 'break-spaces' }}>
            {data.content ?? <Skeleton width="100%" height="2em" />}
          </p>
        </div>
      )}
      <footer className={styles.footer}>
        <div className={styles.sender}>
          {data ? <span>送信者: </span> : <Skeleton width="4em" />}
          <Link className={styles.senderLink({ disabled: !data })} href={`/users/${data?.sender.id}`}>
            <UserIcon className={styles.senderIcon} fragment={data?.sender} />
            <span className={styles.senderName}>{data?.sender.name ?? <Skeleton width="8em" />}</span>
          </Link>
        </div>
        {data ? (
          <time dateTime={data.createdAt}>
            {format(data.createdAt, 'yyyy/MM/dd HH:mm', { in: tz('Asia/Tokyo') })}
          </time>
        ) : (
          <Skeleton width="8em" />
        )}
      </footer>
    </article>
  );
};
