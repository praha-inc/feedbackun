import { style } from '@vanilla-extract/css';

import { theme } from '../../../themes';

export const list = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '6px',
  borderRadius: theme.size.radius.medium,
  backgroundColor: theme.color.token.tabs.background,
});

export const trigger = style({
  flex: 1,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  whiteSpace: 'nowrap',
  color: theme.color.token.tabs.text,
  border: 'none',
  borderRadius: theme.size.radius.normal,
  backgroundColor: 'transparent',
  padding: '6px 12px',
  fontWeight: 500,
  fontSize: theme.size.font.normal,
  transitionDuration: theme.duration.normal,
  transitionProperty: 'color, background-color, box-shadow',
  selectors: {
    '&[data-state="active"]': {
      color: theme.color.token.tabs.active.text,
      backgroundColor: theme.color.token.tabs.active.background,
      boxShadow: `${theme.size.shadow.tiny} ${theme.color.token.semantic.shadow}`,
    },
  },
});
