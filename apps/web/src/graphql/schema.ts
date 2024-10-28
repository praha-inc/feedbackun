import { builder } from './core/builder';

import './core/connection';
import './resolvers/feedbacks';
import './resolvers/skill-elements';
import './resolvers/slack-channels';
import './resolvers/slack-messages';
import './resolvers/users';

export const createSchema = (...arguments_: Parameters<typeof builder.toSchema>) => builder.toSchema(...arguments_);
