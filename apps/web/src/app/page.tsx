import * as styles from './page.css';

import type { FC } from 'react';

export type HomePageProps = {
  //
};

const HomePage: FC<HomePageProps> = () => {
  return (
    <main className={styles.hello}>
      Hello World!
    </main>
  );
};

export default HomePage;
