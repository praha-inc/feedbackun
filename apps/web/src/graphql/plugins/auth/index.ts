import { AsyncLocalStorage } from 'node:async_hooks';

import { findUserSession, UserSessionToken } from '@feedbackun/package-domain';
import { cookies } from 'next/headers';

import type { Plugin } from '@envelop/core';
import type { UserId } from '@feedbackun/package-domain';

export type Auth = {
  id: UserId;
};

const storage = new AsyncLocalStorage<Auth>();

export const useAuth = (): Plugin => ({
  onExecute: ({ executeFn, setExecuteFn }) => {
    setExecuteFn(async (arguments_) => {
      const cookieStore = await cookies();
      const token = cookieStore.get('session_token');
      if (!token) {
        throw new Error('Unauthorized');
      }

      const session = await findUserSession({
        type: 'token',
        token: UserSessionToken.reconstruct(token.value),
      }).unwrapOr(null);

      if (!session || session.isExpired()) {
        throw new Error('Unauthorized');
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return storage.run({ id: session.userId }, async () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return await executeFn(arguments_);
      });
    });
  },
});

export const auth = (): Auth => {
  const auth = storage.getStore();
  if (!auth) {
    throw new Error('Auth not provided');
  }
  return auth;
};
