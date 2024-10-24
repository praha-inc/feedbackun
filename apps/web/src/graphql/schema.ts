import { builder } from './core/builder';

import './resolvers/feedbacks';
import './resolvers/users';

export const createSchema = (...arguments_: Parameters<typeof builder.toSchema>) => builder.toSchema(...arguments_);
