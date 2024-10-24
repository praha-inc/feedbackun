import { builder } from '../../../core/builder';

export const SlackChannel = builder.simpleObject('SlackChannel', {
  description: 'Slackチャンネル',
  fields: (t) => ({
    id: t.id({ description: 'SlackチャンネルID' }),
    name: t.string({ description: 'Slackチャンネル名' }),
  }),
});
