import * as styles from './page.css';
import { graphql } from '../../../../../.graphql';
import { SlackTeamIcon } from '../../../../components/domains/slack/slack-team-icon';
import { UserIcon } from '../../../../components/domains/users/user-icon';
import { graphqlExecutor } from '../../../../graphql';

import type { FC } from 'react';

const UserDetailsPageQuery = graphql(/* GraphQL */ `
  query UserDetailsPage($userId: ID!) {
    userById(userId: $userId) {
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
  }
`);

export type UserDetailsPageProps = {
  params: {
    userId: string;
  };
};

const UserDetailsPage: FC<UserDetailsPageProps> = async ({
  params,
}) => {
  const data = await graphqlExecutor({
    document: UserDetailsPageQuery,
    variables: { userId: params.userId },
  });

  return (
    <section className={styles.wrapper}>
      <UserIcon
        className={styles.userIcon}
        fragment={data.userById}
      />
      <div className={styles.profile}>
        <div>
          <h2 className={styles.userName}>
            {data.userById.name}
          </h2>
          <span className={styles.userType}>
            {data.userById.type}
          </span>
        </div>
        <div className={styles.teams}>
          所属チーム:
          {data.userById.slackUsers.map((slackUser) => (
            <div key={slackUser.slackTeam.id} className={styles.team}>
              <SlackTeamIcon
                className={styles.teamIcon}
                fragment={slackUser.slackTeam}
              />
              <span className={styles.teamName}>
                {slackUser.slackTeam.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UserDetailsPage;
