import { Entity } from '../../../core/entity';

import type { SlackReactionId } from './slack-reaction-id';
import type { SlackEmojiId } from '../../slack-emojis';
import type { SlackMessageId } from '../../slack-messages';
import type { SlackUserId } from '../../slack-users';

export class SlackReaction extends Entity('SlackReaction')<{
  id: SlackReactionId;
  slackMessageId: SlackMessageId;
  slackEmojiId: SlackEmojiId;
  slackUserId: SlackUserId;
  ts: string;
}> {}
