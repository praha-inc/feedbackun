import { feedbackSkills, feedbackSkillsRelations } from './tables/feedback-skills';
import { feedbacks, feedbacksRelations } from './tables/feedbacks';
import { skillElements, skillElementsRelations } from './tables/skill-elements';
import { skillsRelations, skills } from './tables/skills';
import { slackChannels, slackChannelsRelations } from './tables/slack-channels';
import { slackCustomEmojis, slackCustomEmojisRelations } from './tables/slack-custom-emojis';
import { slackEmojis, slackEmojisRelations } from './tables/slack-emojis';
import { slackMessages, slackMessagesRelations } from './tables/slack-messages';
import { slackTeams, slackTeamsRelations } from './tables/slack-teams';
import { slackUnicodeEmojis, slackUnicodeEmojisRelations } from './tables/slack-unicode-emojis';
import { slackUsers, slackUsersRelations } from './tables/slack-users';
import { userSessionRequests, userSessionRequestsRelations } from './tables/user-session-requests';
import { userSessions, userSessionsRelations } from './tables/user-sessions';
import { users, usersRelations } from './tables/users';

import type { Relations, AnyTable } from 'drizzle-orm';

export const schema = {
  feedbacks,
  feedbacksRelations,
  feedbackSkills,
  feedbackSkillsRelations,
  skillElements,
  skillElementsRelations,
  skills,
  skillsRelations,
  slackChannels,
  slackChannelsRelations,
  slackCustomEmojis,
  slackCustomEmojisRelations,
  slackEmojis,
  slackEmojisRelations,
  slackMessages,
  slackMessagesRelations,
  slackTeams,
  slackTeamsRelations,
  slackUnicodeEmojis,
  slackUnicodeEmojisRelations,
  slackUsers,
  slackUsersRelations,
  userSessionRequests,
  userSessionRequestsRelations,
  userSessions,
  userSessionsRelations,
  users,
  usersRelations,
} satisfies Record<string, AnyTable<NonNullable<unknown>> | Relations>;
