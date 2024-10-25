import { Entity } from '../../../core/entity';

import type { FeedbackId } from './feedback-id';
import type { SkillElementId } from '../../skill-elements';
import type { SlackMessageId } from '../../slack-messages';
import type { SlackUserId } from '../../slack-users';

export class Feedback extends Entity('Feedback')<{
  id: FeedbackId;
  sendSlackUserId: SlackUserId;
  receiveSlackUserId: SlackUserId;
  slackMessageId: SlackMessageId;
  skillElementIds: SkillElementId[];
  content: string;
  createdAt: Date;
}> {}
