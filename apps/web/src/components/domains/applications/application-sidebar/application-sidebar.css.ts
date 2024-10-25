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
  flexGrow: 1,
  gap: '8px',
});

export const footer = style({
  display: 'flex',
  flexDirection: 'column',
});

export const user = style({
  display: 'flex',
  flexDirection: 'column',
  textAlign: 'left',
  justifyContent: 'space-between',
  height: '100%',
});

export const userIcon = style({
  fontSize: '2rem',
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
