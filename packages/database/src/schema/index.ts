import { slackChannels, slackChannelsRelations } from './tables/slack-channels';
import { slackCustomEmojis, slackCustomEmojisRelations } from './tables/slack-custom-emojis';
import { slackEmojis, slackEmojisRelations } from './tables/slack-emojis';
import { slackMessages, slackMessagesRelations } from './tables/slack-messages';
import { slackReactions, slackReactionsRelations } from './tables/slack-reactions';
import { slackTeams, slackTeamsRelations } from './tables/slack-teams';
import { slackUnicodeEmojis, slackUnicodeEmojisRelations } from './tables/slack-unicode-emojis';
import { slackUsers, slackUsersRelations } from './tables/slack-users';
import { users, usersRelations } from './tables/users';
import { workSkillElements, workSkillElementsRelations } from './tables/work-skill-elements';
import { workSkillRelations, workSkills } from './tables/work-skills';

import type { Relations, AnyTable } from 'drizzle-orm';

export const schema = {
  slackChannels,
  slackChannelsRelations,
  slackCustomEmojis,
  slackCustomEmojisRelations,
  slackEmojis,
  slackEmojisRelations,
  slackMessages,
  slackMessagesRelations,
  slackReactions,
  slackReactionsRelations,
  slackTeams,
  slackTeamsRelations,
  slackUnicodeEmojis,
  slackUnicodeEmojisRelations,
  slackUsers,
  slackUsersRelations,
  users,
  usersRelations,
  workSkillElements,
  workSkillElementsRelations,
  workSkills,
  workSkillRelations,
} satisfies Record<string, AnyTable<NonNullable<unknown>> | Relations>;
