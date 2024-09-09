import { withDatabase } from '@feedbackun/package-database';
import { SlackApp } from 'slack-edge';

import { submitQuestionHandler } from './actions/submit-question';
import { reactionAddedHandler } from './events/reaction-added';

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
    app.action('submit_question', submitQuestionHandler);

    return withDatabase(env.DB, async () => await app.run(request, context));
  },
};
