import { style } from '@vanilla-extract/css';

import { theme } from '../../../../themes';

export const wrapper = style({
  'display': 'flex',
  'alignItems': 'center',
  'color': theme.color.token.semantic.text,
  ':hover': {
    textDecoration: 'underline',
  },
});

export const icon = style({
  marginBottom: '2px',
});
