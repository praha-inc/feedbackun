import { withDatabase } from '@feedbackun/package-database';
import { getCloudflareContext } from '@opennextjs/cloudflare';

import type { Plugin } from '@envelop/core';

export const useDatabase = (): Plugin => ({
  onExecute: ({ executeFn, setExecuteFn }) => {
    setExecuteFn(async (arguments_) => {
      const { env } = getCloudflareContext();

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return withDatabase(env.DB, async () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return await executeFn(arguments_);
      });
    });
  },
});
