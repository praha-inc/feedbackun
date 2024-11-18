import { Building2Icon, MessageSquareHeartIcon, UsersIcon } from 'lucide-react';
import Link from 'next/link';

import * as styles from './application-sidebar.css';
import { graphql, useFragment } from '../../../../../.graphql';
import { Avatar, AvatarImage } from '../../../elements/avatar';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuButtonIcon,
  SidebarMenuItem,
} from '../../../elements/sidebar';
import { Skeleton } from '../../../elements/skeleton';
import { UserIcon } from '../../users/user-icon';

import type { FragmentType } from '../../../../../.graphql';
import type { FC } from 'react';

export const ApplicationSidebarFragment = graphql(/* GraphQL */ `
  fragment ApplicationSidebar on User {
    id
    type
    name
    ...UserIcon
  }
`);

export type ApplicationSidebarProps = {
  className?: string | undefined;
  fragment: FragmentType<typeof ApplicationSidebarFragment> | undefined;
};

export const ApplicationSidebar: FC<ApplicationSidebarProps> = ({
  className,
  fragment,
}) => {
  const data = useFragment(ApplicationSidebarFragment, fragment);

  return (
    <Sidebar className={className}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="large" asChild>
              <Link href="/">
                <h1 className={styles.title}>
                  <SidebarMenuButtonIcon>
                    <Avatar>
                      <AvatarImage src="/images/feedbackun.png" alt="Logo" />
                    </Avatar>
                  </SidebarMenuButtonIcon>
                  Feedbackun
                </h1>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent asChild>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Slack Teams" asChild>
                  <Link href="/">
                    <SidebarMenuButtonIcon>
                      <Building2Icon />
                    </SidebarMenuButtonIcon>
                    Slack Teams
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Users" asChild>
                  <Link href="/">
                    <SidebarMenuButtonIcon>
                      <UsersIcon />
                    </SidebarMenuButtonIcon>
                    Users
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Feedbacks" asChild>
                  <Link href="/feedbacks">
                    <SidebarMenuButtonIcon>
                      <MessageSquareHeartIcon />
                    </SidebarMenuButtonIcon>
                    Feedbacks
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {/** TODO: ドロップダウンでログアウトできるようにする */}
          <SidebarMenuItem>
            <SidebarMenuButton size="large">
              <SidebarMenuButtonIcon>
                <UserIcon fragment={data} />
              </SidebarMenuButtonIcon>
              <div className={styles.user}>
                <span className={styles.userName}>
                  {data?.name ?? <Skeleton width="8rem" />}
                </span>
                <span className={styles.userType}>
                  {data?.type ?? <Skeleton width="4rem" />}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
