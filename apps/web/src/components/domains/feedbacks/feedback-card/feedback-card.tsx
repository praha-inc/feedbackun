import { tz } from '@date-fns/tz';
import { format } from 'date-fns';
import Link from 'next/link';

import * as styles from './feedback-card.css';
import { graphql, useFragment } from '../../../../../.graphql';
import { Button } from '../../../elements/button';
import { SlackMessageLink } from '../../slack/slack-message-link';
import { SlackTeamIcon } from '../../slack/slack-team-icon';
import { UserIcon } from '../../users/user-icon';
import { FeedbackSkillBadge } from '../feedback-skill-badge';

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
  fragment: FragmentType<typeof FeedbackCardFragment>;
};

export const FeedbackCard: FC<FeedbackCardProps> = ({
  fragment,
}) => {
  const data = useFragment(FeedbackCardFragment, fragment);

  return (
    <article className={styles.wrapper}>
      <header>
        <Button variant="ghost" size="medium" borderless asChild>
          <Link className={styles.profile} href={`/users/${data.recipient.id}`}>
            <UserIcon className={styles.recipientIcon} fragment={data.recipient} />
            <div className={styles.recipient}>
              <span className={styles.recipientName}>
                {data.recipient.name}
              </span>
              <span className={styles.recipientType}>
                {data.recipient.type}
              </span>
            </div>
          </Link>
        </Button>
      </header>
      <div className={styles.supplemental}>
        <div className={styles.slack}>
          <SlackTeamIcon
            className={styles.teamIcon}
            fragment={data.slackMessage.slackChannel.slackTeam}
          />
          <span className={styles.team}>
            {data.slackMessage.slackChannel.slackTeam.name}
          </span>
          ・
          <span className={styles.channel}>
            チャンネル: #{data.slackMessage.slackChannel.name}
          </span>
        </div>
        <SlackMessageLink fragment={data.slackMessage} />
      </div>
      <div className={styles.message}>
        <p className={styles.lineClamp}>
          {data.slackMessage.content}
        </p>
      </div>
      {0 < data.assignedSkills.length && (
        <div className={styles.skills}>
          {data.assignedSkills.map((assignedSkill, index) => (
            <FeedbackSkillBadge key={index} fragment={assignedSkill} />
          ))}
        </div>
      )}
      {data.content && (
        <div className={styles.comment}>
          {/* TODO: フィードバック詳細画面を作ったら styles.lineClamp を当てるようにする */}
          <p style={{ whiteSpace: 'break-spaces' }}>
            {data.content}
          </p>
        </div>
      )}
      <footer className={styles.footer}>
        <div className={styles.sender}>
          <span>送信者: </span>
          <Link className={styles.senderName} href={`/users/${data.sender.id}`}>
            <UserIcon className={styles.senderIcon} fragment={data.sender} />
            <span>{data.sender.name}</span>
          </Link>
        </div>
        <time dateTime={data.createdAt}>
          {format(data.createdAt, 'yyyy/MM/dd HH:mm', { in: tz('Asia/Tokyo') })}
        </time>
      </footer>
    </article>
  );
};
