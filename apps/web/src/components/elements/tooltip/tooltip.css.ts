import { style } from '@vanilla-extract/css';
import deepmerge from 'deepmerge';

import { animateIn, animateOut } from '../../../styles/transitions/animate.css';
import { fadeIn, fadeOut } from '../../../styles/transitions/fade.css';
import {
  slideInFromBottom,
  slideInFromLeft,
  slideInFromRight,
  slideInFromTop,
  slideOutToBottom,
  slideOutToLeft,
  slideOutToRight,
  slideOutToTop,
} from '../../../styles/transitions/slide.css';
import { theme } from '../../../themes';

import type { StyleRule } from '@vanilla-extract/css';

export const content = style([
  animateIn(),
  fadeIn(),
  {
    zIndex: 100,
    padding: '6px 8px',
    color: theme.color.token.tooltip.text,
    fill: theme.color.token.tooltip.background,
    backgroundColor: theme.color.token.tooltip.background,
    borderRadius: theme.size.radius.medium,
    selectors: {
      '&[data-state="closed"]': deepmerge.all<StyleRule>([
        animateOut(),
        fadeOut(),
      ]),
      '&[data-side="left"]': deepmerge.all<StyleRule>([
        slideInFromRight('2px'),
        slideOutToRight('2px'),
      ]),
      '&[data-side="right"]': deepmerge.all<StyleRule>([
        slideInFromLeft('2px'),
        slideOutToLeft('2px'),
      ]),
      '&[data-side="bottom"]': deepmerge.all<StyleRule>([
        slideInFromTop('2px'),
        slideOutToTop('2px'),
      ]),
      '&[data-side="top"]': deepmerge.all<StyleRule>([
        slideInFromBottom('2px'),
        slideOutToBottom('2px'),
      ]),
    },
  },
]);
