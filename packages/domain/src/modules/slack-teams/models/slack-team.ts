import { Entity } from '../../../core/entity';

import type { SlackTeamId } from './slack-team-id';

export class SlackTeam extends Entity('SlackTeam')<{
  id: SlackTeamId;
  name: string;
  domain: string;
}> {}
