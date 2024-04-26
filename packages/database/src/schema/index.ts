import { slackTeams } from './tables/slack-teams';

import type { Relations, AnyTable } from 'drizzle-orm';

export const schema = {
  slackTeams,
} satisfies Record<string, AnyTable<NonNullable<unknown>> | Relations>;
