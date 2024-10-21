import { Entity } from '../../../core/entity';

import type { UserSessionRequestId } from './user-session-request-id';
import type { UserId } from '../../users';

export class UserSessionRequest extends Entity('UserSessionRequest')<{
  id: UserSessionRequestId;
  userId: UserId;
  token: string;
  expiredAt: Date;
}> {}
