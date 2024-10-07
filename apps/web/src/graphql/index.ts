import { buildHTTPExecutor } from '@graphql-tools/executor-http';
import { createYoga } from 'graphql-yoga';

import { createSchema } from './schema';

const yoga = createYoga({
  schema: createSchema(),
});

export const executor = buildHTTPExecutor(yoga);
