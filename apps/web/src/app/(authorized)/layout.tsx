import { Suspense } from 'react';

import * as styles from './layout.css';
import AuthorizedSidebar from './sidebar';
import { ApplicationHeader } from '../../components/domains/applications/application-header';
import { ApplicationSidebar } from '../../components/domains/applications/application-sidebar';
import { ScrollArea, ScrollAreaViewport } from '../../components/elements/scroll-area';
import { SidebarInset, SidebarProvider } from '../../components/elements/sidebar';

import type { FC, ReactNode } from 'react';

export const dynamic = 'force-dynamic';

export type AuthorizedLayoutProps = {
  children: ReactNode;
};

const AuthorizedLayout: FC<AuthorizedLayoutProps> = ({
  children,
}) => {
  return (
    <SidebarProvider>
      <Suspense fallback={<ApplicationSidebar fragment={undefined} />}>
        <AuthorizedSidebar />
      </Suspense>
      <SidebarInset asChild>
        <ScrollArea className={styles.wrapper}>
          <ScrollAreaViewport vertical>
            <ApplicationHeader />
            <main className={styles.container}>
              {children}
            </main>
          </ScrollAreaViewport>
        </ScrollArea>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AuthorizedLayout;
