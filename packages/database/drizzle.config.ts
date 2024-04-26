import type { Config } from 'drizzle-kit';

export default {
  schema: './src/schema/tables/*',
  out: './migrations',
} satisfies Config;
