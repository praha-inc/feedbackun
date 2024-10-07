import { writeFileSync } from 'node:fs';

import { lexicographicSortSchema, printSchema } from 'graphql';

import { createSchema } from '../src/graphql/schema';

const sortedSchema = lexicographicSortSchema(createSchema());

writeFileSync('./schema.graphql', printSchema(sortedSchema));
