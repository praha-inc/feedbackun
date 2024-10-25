import { Entity } from '../../../core/entity';

import type { SlackUserId } from './slack-user-id';
import type { SlackTeamId } from '../../slack-teams';
import type { UserId } from '../../users';

export class SlackUser extends Entity('SlackUser')<{
  id: SlackUserId;
  userId: UserId;
  slackTeamId: SlackTeamId;
  name: string;
}> {}
