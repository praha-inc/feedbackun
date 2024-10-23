import { differenceInDays } from 'date-fns';

import { UserSessionId } from './user-session-id';
import { UserSessionToken } from './user-session-token';
import { Entity } from '../../../core/entity';

import type { UserId } from '../../users';

export class UserSession extends Entity('UserSession')<{
  id: UserSessionId;
  userId: UserId;
  token: UserSessionToken;
  createdAt: Date;
}> {
  public static new(userId: UserId): UserSession {
    return new UserSession({
      id: UserSessionId.new(),
      userId,
      token: UserSessionToken.new(),
      createdAt: new Date(),
    });
  }

  public isExpired(): boolean {
    return 7 <= differenceInDays(new Date(), this.createdAt);
  }
}
