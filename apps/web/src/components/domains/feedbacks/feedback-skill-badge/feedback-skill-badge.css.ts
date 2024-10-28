import { style } from '@vanilla-extract/css';

import { theme } from '../../../../themes';

export const skill = style({
  fontSize: theme.size.font.tiny,
});

export const elements = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  fontSize: theme.size.font.tiny,
});
