import { SlackApp } from 'slack-edge';

import type { Env } from './type/env';

export default {
  async fetch(
    request: Request,
    env: Env,
    context: ExecutionContext,
  ): Promise<Response> {
    const app = new SlackApp({ env });
    return await app.run(request, context);
  },
};
