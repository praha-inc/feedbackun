import { style } from '@vanilla-extract/css';

import { theme } from '../../../../themes';

export const content = style({
  marginTop: '16px',
});

export const header = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

export const title = style({
  fontSize: '1.5rem',
  fontWeight: 600,
  lineHeight: 1,
  margin: 0,
});

export const description = style({
  fontSize: theme.size.font.normal,
  color: theme.color.token.semantic.textMuted,
});
