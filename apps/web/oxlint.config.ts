import { react } from '@praha/oxlint-config-react';
import { defineConfig } from 'oxlint';

import config from '../../oxlint.config.ts';

export default defineConfig({
  extends: [
    config,
    react(),
  ],
  ignorePatterns: [
    '.graphql',
    '.save.next',
    '.worker-next',
    'next-env.d.ts',
  ],
});
