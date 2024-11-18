import { globalStyle, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import deepmerge from 'deepmerge';

import { animateIn, animateOut } from '../../../styles/transitions/animate.css';
import { fadeIn, fadeOut } from '../../../styles/transitions/fade.css';
import { theme } from '../../../themes';

import type { StyleRule } from '@vanilla-extract/css';

export const wrapper = style({
  position: 'relative',
  overflow: 'hidden',
});

export const container = style({
  width: '100%',
  height: '100%',
  borderRadius: 'inherit',
});

export const bar = recipe({
  base: [
    animateIn(),
    fadeIn(),
    {
      display: 'flex',
      touchAction: 'none',
      userSelect: 'none',
      padding: '1px',
      selectors: {
        '&[data-state="hidden"]': deepmerge.all<StyleRule>([
          animateOut(),
          fadeOut(),
        ]),
      },
    },
  ],
  variants: {
    orientation: {
      vertical: {
        width: '10px',
        height: '100%',
        flexDirection: 'row',
        borderLeft: '1px solid transparent',
      },
      horizontal: {
        height: '10px',
        width: '100%',
        flexDirection: 'column',
        borderTop: '1px solid transparent',
      },
    },
  },
});

export const thumb = style({
  position: 'relative',
  flex: 1,
  borderRadius: theme.size.radius.pill,
  backgroundColor: theme.color.token.semantic.border,
});

// Viewportに`display: table`が指定されている影響で、`text-overflow: ellipsis`が効かないため、強制的に`display: block`を指定する
// @see: https://github.com/radix-ui/primitives/issues/926
globalStyle(`div[data-radix-scroll-area-viewport] > div`, {
  display: 'block !important',
});
