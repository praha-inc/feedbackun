import { defineConfig } from 'oxlint';

import config from '../../oxlint.config.ts';

export default defineConfig({
  extends: [
    config,
  ],
  rules: {
    'unicorn/require-post-message-target-origin': 'off',
  },
});
