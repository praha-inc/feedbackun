import { DateTimeResolver } from 'graphql-scalars';

import { builder } from '../core/builder';

export const DateTime = builder.addScalarType('DateTime', DateTimeResolver, {});
