import { style } from '@vanilla-extract/css';

import { theme } from '../../../../themes';

export const wrapper = style({
  display: 'flex',
  backgroundColor: theme.color.token.semantic.backgroundInset,
  borderBottom: 'solid 1px',
  borderColor: theme.color.token.semantic.border,
  padding: '16px',
});
