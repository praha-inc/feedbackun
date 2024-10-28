import { builder } from '../../../core/builder';

export const SlackUser = builder.simpleObject('SlackUser', {
  description: 'Slackユーザー',
  fields: (t) => ({
    id: t.id({ description: 'SlackユーザーID' }),
    name: t.string({ description: 'Slackユーザー名' }),
  }),
});
