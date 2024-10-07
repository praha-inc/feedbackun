import { clsx } from 'clsx';
import { Building2Icon, MessageSquareHeartIcon, UsersIcon } from 'lucide-react';
import Link from 'next/link';

import * as styles from './application-sidebar.css';
import { Button, ButtonIcon } from '../../../elements/button';

import type { FC } from 'react';

export type ApplicationSidebarProps = {
  className?: string | undefined;
};

export const ApplicationSidebar: FC<ApplicationSidebarProps> = ({
  className,
}) => {
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
    </aside>
  );
};
