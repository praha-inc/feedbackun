import { style } from '@vanilla-extract/css';

import { theme } from '../../../themes';

export const wrapper = style({
  position: 'relative',
  display: 'flex',
  flexShrink: 0,
  overflow: 'hidden',
  width: '1em',
  height: '1em',
  borderRadius: theme.size.radius.medium,
});

export const fallback = style({
  display: 'flex',
  width: '100%',
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 'min(1rem, .5em)',
  backgroundColor: theme.color.token.semantic.backgroundMuted,
  color: theme.color.token.semantic.text,
});

export const image = style({
  aspectRatio: '1 / 1',
  width: '100%',
  height: '100%',
});
