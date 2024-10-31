import { TabsContent } from '../../../../../components/elements/tabs';

import type { FC } from 'react';

export type UserDetailsReceivedFeedbacksPageProps = {
  params: {
    userId: string;
  };
};

const UserDetailsReceivedFeedbacksPage: FC<UserDetailsReceivedFeedbacksPageProps> = () => {
  return (
    <TabsContent value="received">
      <h3>
        受信したフィードバック
      </h3>
    </TabsContent>
  );
};

export default UserDetailsReceivedFeedbacksPage;
