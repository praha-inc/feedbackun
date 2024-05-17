import type { Env } from '../../types/env';
import type { EventLazyHandler } from 'slack-edge/dist/handler/handler';

export const reactionAddedHandler: EventLazyHandler<'reaction_added', Env> = ({
  env: _env,
  context: _context,
  payload,
}) => {
  console.log('reaction_added event received', payload);
  return Promise.resolve();
};
