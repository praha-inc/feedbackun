import { graphql, useFragment } from '../../../../../.graphql';
import { Avatar, AvatarFallback, AvatarImage } from '../../../elements/avatar';

import type { FragmentType } from '../../../../../.graphql';
import type { FC } from 'react';

export const UserIconFragment = graphql(/* GraphQL */ `
  fragment UserIcon on User {
    id
    name
    icon
  }
`);

export type UserIconProps = {
  className?: string | undefined;
  fragment: FragmentType<typeof UserIconFragment>;
};

export const UserIcon: FC<UserIconProps> = ({
  className,
  fragment,
}) => {
  const data = useFragment(UserIconFragment, fragment);

  return (
    <Avatar className={className}>
      <AvatarImage
        src={data.icon}
        alt={data.name}
      />
      <AvatarFallback>
        {data.name.at(0)}
      </AvatarFallback>
    </Avatar>
  );
};
