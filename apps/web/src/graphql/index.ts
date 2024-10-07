import { buildHTTPExecutor } from '@graphql-tools/executor-http';
import { createYoga } from 'graphql-yoga';

import { createSchema } from './schema';

import type { HTTPExecutorOptions } from '@graphql-tools/executor-http';
import type { ExecutionRequest, ExecutionResult } from '@graphql-tools/utils';

import 'server-only';

const yoga = createYoga({
  schema: createSchema(),
});

const executor = buildHTTPExecutor(yoga);

export const graphqlExecutor = <
  TReturn = unknown,
  TArgs extends Record<string, unknown> = Record<string, unknown>,
  TRoot = unknown,
>(
  request: Omit<ExecutionRequest<TArgs, unknown, TRoot, HTTPExecutorOptions, TReturn>, 'extensions'>,
): Promise<ExecutionResult<TReturn>> => {
  const result = executor({
    ...request,
    extensions: {
      endpoint: 'http://localhost/graphql',
    },
  });

  if (Symbol.asyncIterator in result) {
    throw new Error('Expected single value');
  }

  return result as Promise<ExecutionResult<TReturn>>;
};
