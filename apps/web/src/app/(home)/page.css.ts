import { style } from '@vanilla-extract/css';

import { theme } from '../../themes';

export const aside = style({
  display: 'flex',
  flexDirection: 'column',
  padding: '16px',
  maxWidth: '16rem',
  height: '100dvh',
  backgroundColor: theme.color.token.semantic.backgroundInset,
  borderRight: 'solid 1px',
  borderColor: theme.color.token.semantic.border,
});

export const title = style({
  textAlign: 'center',
});

export const nav = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});
