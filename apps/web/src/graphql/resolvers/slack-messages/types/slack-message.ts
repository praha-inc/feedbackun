import { builder } from '../../../core/builder';

export const SlackMessage = builder.simpleObject('SlackMessage', {
  description: 'Slackメッセージ',
  fields: (t) => ({
    id: t.id({ description: 'SlackメッセージID' }),
    content: t.string({ description: 'Slackメッセージ内容' }),
  }),
});
