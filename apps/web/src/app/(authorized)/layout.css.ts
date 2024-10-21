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
});

export const header = style({
  gridArea: 'header',
});

export const sidebar = style({
  gridArea: 'aside',
});

export const nav = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

export const main = style({
  gridArea: 'main',
  backgroundColor: theme.color.token.semantic.backgroundInset,
});