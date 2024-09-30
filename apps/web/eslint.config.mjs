// @ts-nocheck

import { define } from '@agaroot/eslint-config-definer';
import { next } from '@agaroot/eslint-config-next';
import { react } from '@agaroot/eslint-config-react';

import { config as base } from '../../eslint.config.js';

const config = define([
  base,
  react,
  next,
  () => [{
    ignores: [
      '.worker-next',
    ],
  }],
]);

export default config({
  tsconfigPath: './tsconfig.json',
});
