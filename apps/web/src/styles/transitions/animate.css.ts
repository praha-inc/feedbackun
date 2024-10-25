import { enter } from '../keyframes/enter.css';
import { exit } from '../keyframes/exit.css';
import { enterOpacity, exitOpacity } from '../vars/opacity.css';

import type { StyleRule } from '@vanilla-extract/css';

export const animateIn = (value = '.25s'): StyleRule => ({
  animationName: `${enter}`,
  animationDuration: value,
  vars: {
    [enterOpacity]: 'initial',
  },
});

export const animateOut = (value = '.25s'): StyleRule => ({
  animationName: `${exit}`,
  animationDuration: value,
  vars: {
    [exitOpacity]: 'initial',
  },
});
