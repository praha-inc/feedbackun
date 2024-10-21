import { Entity } from '../../../core/entity';

import type { UserSessionId } from './user-session-id';
import type { UserId } from '../../users';

export class UserSession extends Entity('UserSession')<{
  id: UserSessionId;
  userId: UserId;
  token: string;
  createdAt: Date;
}> {}
