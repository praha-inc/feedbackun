import { clsx } from 'clsx';

import * as styles from './user-profile-card.css';
import { graphql, useFragment } from '../../../../../.graphql';
import { Skeleton } from '../../../elements/skeleton';
import { SlackTeamIcon } from '../../slack/slack-team-icon';
import { UserIcon } from '../user-icon';

import type { FragmentType } from '../../../../../.graphql';
import type { FC } from 'react';

const UserProfileCardFragment = graphql(/* GraphQL */ `
  fragment UserProfileCard on User {
    id
    type
    name
    ...UserIcon
    slackUsers {
      id
      slackTeam {
        id
        name
        ...SlackTeamIcon
      }
    }
  }
`);

export type UserProfileCardProps = {
  className?: string | undefined;
  fragment: FragmentType<typeof UserProfileCardFragment> | undefined;
};

export const UserProfileCard: FC<UserProfileCardProps> = ({
  className,
  fragment,
}) => {
  const data = useFragment(UserProfileCardFragment, fragment);
  const slackUsers = data?.slackUsers ?? Array.from<undefined>({ length: 2 });

  return (
    <section className={clsx(styles.wrapper, className)}>
      <UserIcon
        className={styles.userIcon}
        fragment={data}
      />
      <div className={styles.profile}>
        <div>
          <h2 className={styles.userName}>
            {data?.name ?? <Skeleton width="8em" />}
          </h2>
          <div className={styles.userType}>
            {data?.type ?? <Skeleton width="4em" />}
          </div>
        </div>
        <div className={styles.teams}>
          {data ? '所属チーム' : <Skeleton width="6em" />}
          {slackUsers.map((slackUser, index) => (
            <div key={slackUser?.slackTeam.id ?? index} className={styles.team}>
              <SlackTeamIcon
                className={styles.teamIcon}
                fragment={slackUser?.slackTeam}
              />
              <span className={styles.teamName}>
                {slackUser?.slackTeam.name ?? <Skeleton width="4em" />}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
