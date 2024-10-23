import { builder } from '../../../core/builder';

export const UserType = builder.enumType('UserType', {
  description: 'ユーザー種別',
  values: ['engineer', 'designer'] as const,
});
