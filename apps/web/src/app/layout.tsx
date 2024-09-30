import { Noto_Sans_JP } from 'next/font/google';

import type { Metadata } from 'next';
import type { FC, ReactNode } from 'react';

import 'modern-normalize';

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Feedbackun',
};

export type RootLayoutProps = {
  children: ReactNode;
};

const RootLayout: FC<RootLayoutProps> = ({
  children,
}) => {
  return (
    <html lang="ja">
      <body className={notoSansJP.className}>
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
