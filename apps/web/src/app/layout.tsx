import { clsx } from 'clsx';
import { Noto_Sans_JP, Roboto_Flex } from 'next/font/google';

import { TooltipProvider } from '../components/elements/tooltip';

import type { Metadata } from 'next';
import type { FC } from 'react';

import 'modern-normalize';
import './layout.css';

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  variable: '--font-noto-sans-jp',
});

const roboto = Roboto_Flex({
  subsets: ['latin'],
  variable: '--font-roboto',
});

export const metadata: Metadata = {
  title: 'Feedbackun',
};

export type RootLayoutProps = LayoutProps<'/'>;

const RootLayout: FC<RootLayoutProps> = ({
  children,
}) => {
  return (
    <html lang="ja">
      <body className={clsx(notoSansJP.variable, roboto.variable)}>
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
};

export default RootLayout;
