import { clsx } from 'clsx';
import { Building2Icon, MessageSquareHeartIcon, UsersIcon } from 'lucide-react';
import Link from 'next/link';

import * as styles from './application-sidebar.css';
import { graphql, useFragment } from '../../../../../.graphql';
import { Button, ButtonIcon } from '../../../elements/button';
import { UserIcon } from '../../user/user-icon';

import type { FragmentType } from '../../../../../.graphql';
import type { FC } from 'react';

export const ApplicationSidebarFragment = graphql(/* GraphQL */ `
  fragment ApplicationSidebar on User {
    id
    type
    name
    ...UserIcon
  }
`);

export type ApplicationSidebarProps = {
  className?: string | undefined;
  fragment: FragmentType<typeof ApplicationSidebarFragment>;
};

export const ApplicationSidebar: FC<ApplicationSidebarProps> = ({
  className,
  fragment,
}) => {
  const data = useFragment(ApplicationSidebarFragment, fragment);

  return (
    <aside className={clsx(styles.wrapper, className)}>
      <nav className={styles.nav}>
        <Button variant="ghost" size="medium" borderless asChild>
          <Link href="/">
            <ButtonIcon>
              <Building2Icon />
            </ButtonIcon>
            Slack Teams
          </Link>
        </Button>
        <Button variant="ghost" size="medium" borderless asChild>
          <Link href="/">
            <ButtonIcon>
              <UsersIcon />
            </ButtonIcon>
            Users
          </Link>
        </Button>
        <Button variant="ghost" size="medium" borderless asChild>
          <Link href="/">
            <ButtonIcon>
              <MessageSquareHeartIcon />
            </ButtonIcon>
            Feedbacks
          </Link>
        </Button>
      </nav>
      <div className={styles.footer}>
        {/** TODO: ドロップダウンでログアウトできるようにする */}
        <Button variant="ghost" size="medium" borderless>
          <UserIcon className={styles.userIcon} fragment={data} />
          <div className={styles.user}>
            <span className={styles.userName}>
              {data.name}
            </span>
            <span className={styles.userType}>
              {data.type}
            </span>
          </div>
        </Button>
      </div>
    </aside>
  );
};
