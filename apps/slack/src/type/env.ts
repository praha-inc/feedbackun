import type { SlackEdgeAppEnv } from 'slack-edge';

export type Env = SlackEdgeAppEnv & {
  DB: D1Database;
};
