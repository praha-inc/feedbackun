import { builder } from '../../../core/builder';

export const SlackTeam = builder.simpleObject('SlackTeam', {
  description: 'Slackチーム',
  fields: (t) => ({
    id: t.id({ description: 'SlackチームID' }),
    name: t.string({ description: 'Slackチーム名' }),
  }),
});
