import { Building2Icon, MessageSquareHeartIcon, UsersIcon } from 'lucide-react';
import Link from 'next/link';

import * as styles from './layout.css';
import { ApplicationHeader } from '../../components/domains/application/application-header';
import { Button, ButtonIcon } from '../../components/elements/button';

import type { FC, ReactNode } from 'react';

export type AuthorizedLayoutProps = {
  children: ReactNode;
};

const AuthorizedLayout: FC<AuthorizedLayoutProps> = ({
  children,
}) => {
  return (
    <div className={styles.wrapper}>
      <ApplicationHeader className={styles.header} />
      <aside className={styles.aside}>
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
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
};

export default AuthorizedLayout;
