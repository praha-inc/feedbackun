'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import * as styles from './user-feedback-list-tabs.css';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../elements/tabs';

import type { FC, ReactNode } from 'react';

export type UserFeedbackListTabsProps = {
  className?: string | undefined;
  children: ReactNode;
};

export const UserFeedbackListTabs: FC<UserFeedbackListTabsProps> = ({
  className,
  children,
}) => {
  const searchParameters = useSearchParams();
  const tab = searchParameters.get('tab') ?? 'received';

  return (
    <Tabs className={className} value={tab} asChild>
      <section>
        <TabsList>
          <TabsTrigger value="received" asChild>
            <Link href={{ query: { tab: 'received' } }}>
              受信したフィードバック
            </Link>
          </TabsTrigger>
          <TabsTrigger value="sent" asChild>
            <Link href={{ query: { tab: 'sent' } }}>
              送信したフィードバック
            </Link>
          </TabsTrigger>
        </TabsList>
        <TabsContent className={styles.content} value={tab}>
          {tab === 'received' ? (
            <div className={styles.header}>
              <h3 className={styles.title}>
                受信したフィードバック
              </h3>
              <div className={styles.description}>
                他のユーザーからのフィードバック一覧
              </div>
            </div>
          ) : (
            <div className={styles.header}>
              <h3 className={styles.title}>
                送信したフィードバック
              </h3>
              <div className={styles.description}>
                あなたが送信したフィードバック一覧
              </div>
            </div>
          )}
          {children}
        </TabsContent>
      </section>
    </Tabs>
  );
};
