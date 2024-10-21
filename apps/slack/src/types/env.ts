import type { SlackEdgeAppEnv } from 'slack-edge';

export type Env = SlackEdgeAppEnv & {
  WEB_URL: string;
  DB: D1Database;
};
