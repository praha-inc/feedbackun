import { style } from '@vanilla-extract/css';

import { theme } from '../../themes';

export const wrapper = style({
  display: 'grid',
  gridTemplateAreas: `
    'header header'
    'aside main'
  `,
  gridTemplateRows: 'auto 1fr',
  gridTemplateColumns: 'auto 1fr',
  width: '100dvw',
  height: '100dvh',
  backgroundColor: theme.color.token.semantic.backgroundInset,
});

export const header = style({
  gridArea: 'header',
});

export const main = style({
  gridArea: 'main',
});

export const container = style({
  width: '100%',
  maxWidth: '1024px',
  margin: '0 auto',
  padding: '16px',
});
