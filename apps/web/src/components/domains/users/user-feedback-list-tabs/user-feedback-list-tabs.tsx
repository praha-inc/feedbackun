'use client';

import Link from 'next/link';
import { useParams, useSelectedLayoutSegment } from 'next/navigation';

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
  const parameters = useParams<{ userId: string }>();
  const segment = useSelectedLayoutSegment();

  return (
    <Tabs className={className} value={segment ? 'sent' : 'received'} asChild>
      <section>
        <TabsList>
          <TabsTrigger value="received" asChild>
            <Link href={`/users/${parameters.userId}`}>
              受信したフィードバック
            </Link>
          </TabsTrigger>
          <TabsTrigger value="sent" asChild>
            <Link href={`/users/${parameters.userId}/sent`}>
              送信したフィードバック
            </Link>
          </TabsTrigger>
        </TabsList>
        <TabsContent value={segment ? 'sent' : 'received'}>
          {children}
        </TabsContent>
      </section>
    </Tabs>
  );
};
