// @ts-nocheck

import { common } from '@praha/eslint-config-common';
import { define } from '@praha/eslint-config-definer';
import { javascript } from '@praha/eslint-config-javascript';
import { style } from '@praha/eslint-config-style';
import { typescript } from '@praha/eslint-config-typescript';

export const config = define([
  common,
  javascript,
  typescript,
  style,
  () => [
    {
      ignores: [
        'packages/database/migrations/**',
      ],
    },
    {
      rules: {
        '@typescript-eslint/only-throw-error': 'off',
        'unicorn/throw-new-error': 'off',
      },
    },
  ],
]);

export default config({
  tsconfigPath: './tsconfig.json',
});
