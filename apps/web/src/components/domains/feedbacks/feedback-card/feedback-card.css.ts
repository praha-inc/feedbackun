import { style } from '@vanilla-extract/css';

import { theme } from '../../../../themes';

export const wrapper = style({
  padding: '16px',
  border: `1px solid ${theme.color.token.semantic.border}`,
  borderRadius: theme.size.radius.large,
  backgroundColor: theme.color.token.semantic.background,
});

export const header = style({
  display: 'flex',
  gap: '16px',
});

export const user = style({
  display: 'flex',
  flexDirection: 'column',
  textAlign: 'left',
  justifyContent: 'space-between',
});

export const userIcon = style({
  fontSize: '2.5rem',
});

export const userName = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontWeight: 700,
  fontSize: theme.size.font.medium,
});

export const userType = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontSize: theme.size.font.normal,
  color: theme.color.token.semantic.textMuted,
});

export const supplemental = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: '8px',
});

export const slack = style({
  fontSize: theme.size.font.tiny,
  color: theme.color.token.semantic.textMuted,
});

export const team = style({
  fontWeight: 500,
});

export const channel = style({
  fontWeight: 400,
});

export const message = style({
  padding: '12px',
  marginTop: '8px',
  borderRadius: theme.size.radius.medium,
  backgroundColor: theme.color.token.semantic.backgroundMuted,
});

export const comment = style({
  marginTop: '16px',
  color: theme.color.token.semantic.textMuted,
});

export const footer = style({
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '16px',
  fontSize: theme.size.font.tiny,
  color: theme.color.token.semantic.textMuted,
});

export const lineClamp = style({
  display: '-webkit-box',
  overflow: 'hidden',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
  lineHeight: 1.25,
  whiteSpace: 'break-spaces',
});