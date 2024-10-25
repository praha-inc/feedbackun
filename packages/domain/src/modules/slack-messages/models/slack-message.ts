import { Entity } from '../../../core/entity';

import type { SlackMessageId } from './slack-message-id';
import type { SlackChannelId } from '../../slack-channels';
import type { SlackUserId } from '../../slack-users';

export class SlackMessage extends Entity('SlackMessage')<{
  id: SlackMessageId;
  slackChannelId: SlackChannelId;
  slackUserId: SlackUserId;
  text: string;
  ts: string;
  threadTs: string;
}> {}
