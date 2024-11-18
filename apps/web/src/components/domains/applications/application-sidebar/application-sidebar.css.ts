import { style } from '@vanilla-extract/css';

import { theme } from '../../../../themes';

export const title = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  margin: 0,
  color: theme.color.token.semantic.text,
});

export const user = style({
  display: 'flex',
  flexDirection: 'column',
  textAlign: 'left',
  justifyContent: 'space-between',
  overflow: 'hidden',
});

export const userName = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontWeight: 700,
  fontSize: theme.size.font.normal,
});

export const userType = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontSize: theme.size.font.tiny,
  color: theme.color.token.semantic.textMuted,
});
