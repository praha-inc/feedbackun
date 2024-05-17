import { Entity } from '../../../core/entity';

import type { SlackEmojiId } from './slack-emoji-id';
import type { SlackEmojiType } from './slack-emoji-type';
import type { SlackTeamId } from '../../slack-teams';

export class SlackEmoji extends Entity('SlackEmoji')<{
  id: SlackEmojiId;
  type: SlackEmojiType;
  slackTeamId: SlackTeamId;
  name: string;
}> {}
