import type { Env } from '../../types/env';
import type { EventLazyHandler } from 'slack-edge/dist/handler/handler';

export const reactionRemovedHandler: EventLazyHandler<'reaction_removed', Env> = ({
  env: _env,
  context: _context,
  payload,
}) => {
  console.log('reaction_removed event received', payload);
  return Promise.resolve();
};
