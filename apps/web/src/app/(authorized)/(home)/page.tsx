import { redirect } from 'next/navigation';

import type { FC } from 'react';

export type HomePageProps = PageProps<'/'>;

const HomePage: FC<HomePageProps> = () => {
  redirect('feedbacks');
};

export default HomePage;
