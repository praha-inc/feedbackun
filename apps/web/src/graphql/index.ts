import { buildHTTPExecutor } from '@graphql-tools/executor-http';
import { createYoga } from 'graphql-yoga';

import { useAuth } from './plugins/auth';
import { useDatabase } from './plugins/database';
import { createSchema } from './schema';

import type { HTTPExecutorOptions } from '@graphql-tools/executor-http';
import type { ExecutionRequest } from '@graphql-tools/utils';
import type { GraphQLError } from 'graphql';

import 'server-only';

const yoga = createYoga({
  schema: createSchema(),
  plugins: [
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useAuth(),
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useDatabase(),
  ],
});

const executor = buildHTTPExecutor(yoga);

// eslint-disable-next-line func-style
function assertSingleValue<TValue extends object>(
  value: TValue | AsyncIterable<TValue>,
): asserts value is TValue {
  if (Symbol.asyncIterator in value) {
    throw new Error('Expected single value');
  }
}

export class CombinedGraphQLError extends Error {
  public override readonly name = 'CombinedGraphQLError';

  constructor(public errors: readonly GraphQLError[]) {
    super('CombinedGraphQLError');
  }
}

export const graphqlExecutor = async <
  Return = unknown,
  Args extends Record<string, unknown> = Record<string, unknown>,
  Root = unknown,
>(
  request: Omit<ExecutionRequest<Args, unknown, Root, HTTPExecutorOptions, Return>, 'extensions'>,
): Promise<Return> => {
  const result = await executor({
    ...request,
    extensions: {
      endpoint: 'http://localhost/graphql',
    },
  });
  assertSingleValue(result);

  if (result.errors?.length) {
    throw new CombinedGraphQLError(result.errors);
  }

  return result.data!;
};
