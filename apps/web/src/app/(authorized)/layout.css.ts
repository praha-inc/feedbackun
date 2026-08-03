import { style } from '@vanilla-extract/css';

export const inset = style({
  display: 'flex',
  flexDirection: 'column',
  height: '100svh',
  overflow: 'hidden',
});

export const main = style({
  width: '100%',
  maxWidth: '1024px',
  margin: '0 auto',
  padding: '16px',
});
