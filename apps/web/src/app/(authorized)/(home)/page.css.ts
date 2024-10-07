import { style } from '@vanilla-extract/css';

import { theme } from '../../../themes';

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
  display: 'flex',
  backgroundColor: theme.color.token.semantic.backgroundInset,
  borderBottom: 'solid 1px',
  borderColor: theme.color.token.semantic.border,
  padding: '16px',
});

export const title = style({
  textAlign: 'center',
  margin: 0,
  fontSize: '1.75rem',
});

export const aside = style({
  gridArea: 'aside',
  display: 'flex',
  flexDirection: 'column',
  padding: '16px',
  minWidth: '16rem',
  backgroundColor: theme.color.token.semantic.background,
  borderRight: 'solid 1px',
  borderColor: theme.color.token.semantic.border,
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
