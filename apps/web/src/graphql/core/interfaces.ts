import { builder } from './builder';

export const Error = builder.interfaceType('Error', {
  description: '各エラーのインターフェース',
  fields: (t) => ({
    message: t.exposeString('message', { description: 'エラーメッセージ' }),
  }),
});
