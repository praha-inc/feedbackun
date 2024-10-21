import { UserSessionRequestId } from './user-session-request-id';
import { UserSessionRequestToken } from './user-session-request-token';
import { Entity } from '../../../core/entity';

import type { UserId } from '../../users';

export class UserSessionRequest extends Entity('UserSessionRequest')<{
  id: UserSessionRequestId;
  userId: UserId;
  token: UserSessionRequestToken;
  createdAt: Date;
}> {
  public static new(userId: UserId): UserSessionRequest {
    return new UserSessionRequest({
      id: UserSessionRequestId.new(),
      userId,
      token: UserSessionRequestToken.new(),
      createdAt: new Date(),
    });
  }
}
