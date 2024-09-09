import { Entity } from '../../../core/entity';

import type { FeedbackId } from './feedback-id';
import type { SlackMessageId } from '../../slack-messages';
import type { SlackUserId } from '../../slack-users';
import type { WorkSkillElementId } from '../../work-skill-elements';

export class Feedback extends Entity('Feedback')<{
  id: FeedbackId;
  sendSlackUserId: SlackUserId;
  receiveSlackUserId: SlackUserId;
  slackMessageId: SlackMessageId;
  workSkillElementIds: WorkSkillElementId[];
  content: string;
  createdAt: Date;
}> {}
