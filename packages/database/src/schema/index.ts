import { slackChannels, slackChannelsRelations } from './tables/slack-channels';
import { slackCustomEmojis, slackCustomEmojisRelations } from './tables/slack-custom-emojis';
import { slackEmojis, slackEmojisRelations } from './tables/slack-emojis';
import { slackTeams, slackTeamsRelations } from './tables/slack-teams';
import { slackUnicodeEmojis, slackUnicodeEmojisRelations } from './tables/slack-unicode-emojis';

import type { Relations, AnyTable } from 'drizzle-orm';

export const schema = {
  slackChannels,
  slackChannelsRelations,
  slackCustomEmojis,
  slackCustomEmojisRelations,
  slackEmojis,
  slackEmojisRelations,
  slackTeams,
  slackTeamsRelations,
  slackUnicodeEmojis,
  slackUnicodeEmojisRelations,
} satisfies Record<string, AnyTable<NonNullable<unknown>> | Relations>;
