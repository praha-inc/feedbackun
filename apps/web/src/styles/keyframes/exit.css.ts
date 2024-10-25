import { fallbackVar, keyframes } from '@vanilla-extract/css';

import { exitOpacity } from '../vars/opacity.css';

export const exit = keyframes({
  to: {
    opacity: fallbackVar(exitOpacity, '1'),
  },
});
