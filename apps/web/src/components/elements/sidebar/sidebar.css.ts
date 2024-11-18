import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

import { theme } from '../../../themes';

export const wrapper = style({
  display: 'flex',
  width: '100%',
  minHeight: '100svh',
});

export const sidebar = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
    height: '100svh',
    borderRight: `1px solid ${theme.color.token.sidebar.border}`,
    backgroundColor: theme.color.token.sidebar.background,
    transitionDuration: theme.duration.normal,
    transitionProperty: 'width',
  },
  variants: {
    expand: {
      true: {
        width: '18rem',
      },
      false: {
        width: '3rem',
      },
    },
  },
});

export const content = style({
  flex: 1,
  padding: '8px',
});

export const footer = style({
  width: '100%',
  alignItems: 'end',
  padding: '8px',
});

export const group = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  width: '100%',
});

export const groupContent = style({
  width: '100%',
});

export const header = style({
  width: '100%',
  alignItems: 'start',
  padding: '8px',
});

export const inset = style({
  flex: 1,
});

export const menu = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  width: '100%',
  minWidth: 0,
  padding: 0,
  margin: 0,
});

export const menuButton = recipe({
  base: {
    display: 'flex',
    gap: '8px',
    padding: '8px',
    width: '100%',
    alignItems: 'center',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    outline: 'none',
    border: 'none',
    color: theme.color.token.sidebar.menuButton.text,
    backgroundColor: theme.color.token.sidebar.menuButton.background,
    borderRadius: theme.size.radius.medium,
    transitionDuration: theme.duration.normal,
    transitionProperty: 'color, background-color, width, height, padding',
    selectors: {
      '&:hover': {
        color: theme.color.token.sidebar.menuButton.hover.text,
        backgroundColor: theme.color.token.sidebar.menuButton.hover.background,
      },
      [`${sidebar.classNames.variants.expand.false} &`]: {
        height: '2rem',
      },
    },
  },
  variants: {
    size: {
      normal: {
        selectors: {
          [`${sidebar.classNames.variants.expand.false} &`]: {
            padding: '8px',
          },
        },
      },
      large: {
        selectors: {
          [`${sidebar.classNames.variants.expand.false} &`]: {
            padding: 0,
          },
        },
      },
    },
  },
});

export const menuButtonIcon = style({
  display: 'flex',
  fontSize: '1rem',
  color: theme.color.token.sidebar.menuButton.icon,
  selectors: {
    [`${menuButton.classNames.base}:hover &`]: {
      color: theme.color.token.sidebar.menuButton.hover.icon,
    },
    [`${menuButton.classNames.variants.size.large} &`]: {
      fontSize: '2rem',
    },
  },
});

export const menuItem = style({
  margin: 0,
  listStyle: 'none',
});
