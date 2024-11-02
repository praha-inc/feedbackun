import { style } from '@vanilla-extract/css';

import { theme } from '../../../../themes';

export const wrapper = style({
  display: 'flex',
  gap: '16px',
  padding: '16px',
  border: `1px solid ${theme.color.token.semantic.border}`,
  borderRadius: theme.size.radius.large,
  backgroundColor: theme.color.token.semantic.background,
});

export const userIcon = style({
  fontSize: '6rem',
});

export const profile = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-around',
});

export const userName = style({
  fontWeight: 600,
  fontSize: '2rem',
  margin: 0,
});

export const userType = style({
  color: theme.color.token.semantic.textMuted,
  textTransform: 'capitalize',
  marginTop: '4px',
});

export const teams = style({
  display: 'flex',
  gap: '8px',
  color: theme.color.token.semantic.textMuted,
});

export const team = style({
  display: 'flex',
  gap: '4px',
});

export const teamIcon = style({
  fontSize: theme.size.font.medium,
});

export const teamName = style({
  fontSize: theme.size.font.normal,
  alignSelf: 'center',
});
