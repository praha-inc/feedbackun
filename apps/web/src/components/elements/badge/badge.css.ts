import { style } from '@vanilla-extract/css';

import { theme } from '../../../themes';

export const wrapper = style({
  display: 'inline-flex',
  alignItems: 'center',
  borderRadius: theme.size.radius.pill,
  color: theme.color.token.badge.text,
  backgroundColor: theme.color.token.badge.background,
  border: `1px solid ${theme.color.token.badge.border}`,
  padding: '4px 10px',
  lineHeight: 1,
  transitionDuration: theme.duration.normal,
  transitionProperty: 'color, background-color, border-color',
  selectors: {
    '&:hover': {
      color: theme.color.token.badge.hover.text,
      borderColor: theme.color.token.badge.hover.border,
      backgroundColor: theme.color.token.badge.hover.background,
    },
  },
});
