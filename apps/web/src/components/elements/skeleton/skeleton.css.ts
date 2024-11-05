import { keyframes } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

import { theme } from '../../../themes';

const pulse = keyframes({
  '0%': { opacity: 1 },
  '50%': { opacity: 0.5 },
  '100%': { opacity: 1 },
});

export const wrapper = recipe({
  base: {
    display: 'inline-flex',
    animation: `${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
    backgroundColor: theme.color.token.semantic.backgroundMuted,
  },
  variants: {
    radius: {
      tiny: {
        borderRadius: theme.size.radius.tiny,
      },
      normal: {
        borderRadius: theme.size.radius.normal,
      },
      medium: {
        borderRadius: theme.size.radius.medium,
      },
      large: {
        borderRadius: theme.size.radius.large,
      },
      pill: {
        borderRadius: theme.size.radius.pill,
      },
    },
  },
});
