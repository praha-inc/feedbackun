import { common } from '@agaroot/eslint-config-common';
import { define } from '@agaroot/eslint-config-definer';
import { javascript } from '@agaroot/eslint-config-javascript';
import { style } from '@agaroot/eslint-config-style';
import { typescript } from '@agaroot/eslint-config-typescript';

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
        'unicorn/throw-new-error': 'off',
      },
    },
  ],
]);

export default config({
  tsconfigPath: './tsconfig.json',
});
