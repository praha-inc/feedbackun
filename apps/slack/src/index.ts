import { withDatabase } from '@feedbackun/package-database';
import { SlackApp } from 'slack-edge';

import { discardFeedbackHandler } from './actions/discard-feedback';
import { submitFeedbackHandler } from './actions/submit-feedback';
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
    app.action('submit_feedback', submitFeedbackHandler);
    app.action('discard_feedback', discardFeedbackHandler);

    return withDatabase(env.DB, async () => await app.run(request, context));
  },
};
