import { AuthorizedSidebar } from './_components/sidebar';
import * as styles from './layout.css';
import { ApplicationHeader } from '../../components/domains/applications/application-header';
import { ScrollArea, ScrollAreaViewport } from '../../components/elements/scroll-area';
import { SidebarInset, SidebarProvider } from '../../components/elements/sidebar';

import type { FC } from 'react';

export const dynamic = 'force-dynamic';

export type AuthorizedLayoutProps = LayoutProps<'/'>;

const AuthorizedLayout: FC<AuthorizedLayoutProps> = ({
  children,
}) => {
  return (
    <SidebarProvider>
      <AuthorizedSidebar />
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
