// @ts-nocheck

import { define } from '@praha/eslint-config-definer';
import { next } from '@praha/eslint-config-next';
import { react } from '@praha/eslint-config-react';

import { config as base } from '../../eslint.config.js';

const config = define([
  base,
  react,
  next,
  () => [{
    ignores: [
      '.graphql',
      '.save.next',
      '.worker-next',
      'next-env.d.ts',
    ],
  }],
]);

export default config({
  tsconfigPath: './tsconfig.json',
});
