import { Entity } from '../../../core/entity';

import type { SlackChannelId } from './slack-channel-id';
import type { SlackTeamId } from '../../slack-teams';

export class SlackChannel extends Entity('SlackChannel')<{
  id: SlackChannelId;
  slackTeamId: SlackTeamId;
  name: string;
}> {}
