// @ts-nocheck

import { config } from '../../eslint.config.js';

export default [
  ...config({
    tsconfigPath: './tsconfig.json',
  }),
  {
    ignores: [
      'migrations',
    ],
  },
];
