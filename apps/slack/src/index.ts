import { withDatabase } from '@feedbackun/package-database';
import { SlackApp } from 'slack-edge';

import { reactionAddedHandler } from './events/reaction-added';
import { reactionRemovedHandler } from './events/reaction-removed';

import type { Env } from './types/env';

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

    return withDatabase(env.DB, async () => await app.run(request, context));
  },
};
