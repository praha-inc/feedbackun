import { style } from '@vanilla-extract/css';

import { theme } from '../../../../themes';

export const wrapper = style({
  display: 'flex',
  flexDirection: 'column',
  padding: '16px',
  minWidth: '16rem',
  backgroundColor: theme.color.token.semantic.background,
  borderRight: 'solid 1px',
  borderColor: theme.color.token.semantic.border,
});

export const nav = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});
