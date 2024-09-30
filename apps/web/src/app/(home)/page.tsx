import { Building2Icon, MessageSquareHeartIcon, UsersIcon } from 'lucide-react';
import Link from 'next/link';

import * as styles from './page.css';
import { Button, ButtonIcon } from '../../components/elements/button';

import type { FC } from 'react';

export type HomePageProps = {
  //
};

const HomePage: FC<HomePageProps> = () => {
  return (
    <aside className={styles.aside}>
      <h1 className={styles.title}>
        Feedbackun
      </h1>
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

export default HomePage;
