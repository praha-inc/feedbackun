import { TabsContent } from '../../../../../../components/elements/tabs';

import type { FC } from 'react';

export type UserDetailsSentFeedbacksPageProps = {
  params: {
    userId: string;
  };
};

const UserDetailsSentFeedbacksPage: FC<UserDetailsSentFeedbacksPageProps> = () => {
  return (
    <TabsContent value="sent">
      <h3>
        送信したフィードバック
      </h3>
    </TabsContent>
  );
};

export default UserDetailsSentFeedbacksPage;
