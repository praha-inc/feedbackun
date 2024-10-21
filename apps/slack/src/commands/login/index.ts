import type { Env } from '../../types/env';
import type { SlashCommandLazyHandler } from 'slack-edge';

export const loginCommandHandler: SlashCommandLazyHandler<Env> = async ({
  context,
  payload,
}) => {
  console.log('loginCommandHandler', context, payload);
  return await Promise.resolve();
};
