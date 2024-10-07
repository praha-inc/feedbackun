import { readFileSync } from 'node:fs';

import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: readFileSync('./schema.graphql', 'utf8').toString(),
  documents: ['src/**/*.ts', 'src/**/*.tsx'],
  ignoreNoDocuments: true,
  generates: {
    '.graphql/': {
      preset: 'client',
      config: {
        arrayInputCoercion: false,
        scalars: {
          ID: 'string',
          DateTime: 'string',
        },
      },
    },
  },
};

export default config;
