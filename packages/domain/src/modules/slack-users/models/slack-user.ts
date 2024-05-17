import { Entity } from '../../../core/entity';

import type { SlackUserId } from './slack-user-id';
import type { SlackTeamId } from '../../slack-teams';

export class SlackUser extends Entity('SlackUser')<{
  id: SlackUserId;
  slackTeamId: SlackTeamId;
  name: string;
}> {}
