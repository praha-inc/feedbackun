import { SlackApp } from 'slack-edge';

import { reactionAddedHandler } from './event/reaction-added';
import { reactionRemovedHandler } from './event/reaction-removed';

import type { Env } from './type/env';

export default {
  async fetch(
    request: Request,
    env: Env,
    context: ExecutionContext,
  ): Promise<Response> {
    const app = new SlackApp({ env });

    // Add event handlers
    app.event('reaction_added', reactionAddedHandler);
    app.event('reaction_removed', reactionRemovedHandler);

    return await app.run(request, context);
  },
};
