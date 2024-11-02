import { graphql, useFragment } from '../../../../../.graphql';
import { Avatar, AvatarFallback, AvatarImage } from '../../../elements/avatar';
import { Skeleton } from '../../../elements/skeleton';

import type { FragmentType } from '../../../../../.graphql';
import type { FC } from 'react';

export const SlackTeamIconFragment = graphql(/* GraphQL */ `
  fragment SlackTeamIcon on SlackTeam {
    id
    name
    icon
  }
`);

export type SlackTeamIconProps = {
  className?: string | undefined;
  fragment?: FragmentType<typeof SlackTeamIconFragment> | undefined;
};

export const SlackTeamIcon: FC<SlackTeamIconProps> = ({
  className,
  fragment,
}) => {
  const data = useFragment(SlackTeamIconFragment, fragment);

  return (
    <Avatar className={className}>
      {data ? (
        <>
          <AvatarImage
            src={data.icon}
            alt={data.name}
          />
          <AvatarFallback>
            {data.name.at(0)}
          </AvatarFallback>
        </>
      ) : (
        <Skeleton radius="medium" />
      )}
    </Avatar>
  );
};
