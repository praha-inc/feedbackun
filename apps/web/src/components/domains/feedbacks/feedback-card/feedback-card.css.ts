import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

import { theme } from '../../../../themes';

export const wrapper = style({
  padding: '16px',
  border: `1px solid ${theme.color.token.semantic.borderMuted}`,
  borderRadius: theme.size.radius.large,
  backgroundColor: theme.color.token.semantic.background,
});

export const profile = recipe({
  base: {
    display: 'inline-flex',
    gap: '12px',
    margin: '-8px 0 0 -8px',
    color: theme.color.token.semantic.text,
  },
  variants: {
    disabled: {
      true: {
        pointerEvents: 'none',
      },
    },
  },
});

export const recipient = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  textAlign: 'left',
  justifyContent: 'space-between',
});

export const recipientIcon = style({
  fontSize: '2.5rem',
});

export const recipientName = style({
  display: 'flex',
  fontWeight: 700,
  fontSize: theme.size.font.medium,
});

export const recipientType = style({
  display: 'flex',
  textTransform: 'capitalize',
  fontSize: theme.size.font.normal,
  color: theme.color.token.semantic.textMuted,
});

export const supplemental = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: '8px',
  fontSize: theme.size.font.tiny,
});

export const slack = style({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  color: theme.color.token.semantic.textMuted,
});

export const teamIcon = style({
  fontSize: '1rem',
});

export const team = style({
  display: 'flex',
  fontWeight: 500,
});

export const channel = style({
  display: 'flex',
  fontWeight: 400,
  alignItems: 'center',
  gap: '4px',
});

export const messageContainer = style({
  marginTop: '8px',
});

export const message = style({
  padding: '12px',
  borderRadius: theme.size.radius.medium,
  backgroundColor: theme.color.token.semantic.backgroundMuted,
});

export const skills = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  marginTop: '8px',
});

export const comment = style({
  marginTop: '16px',
  color: theme.color.token.semantic.textMuted,
});

export const footer = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: '16px',
  fontSize: theme.size.font.tiny,
  color: theme.color.token.semantic.textMuted,
});

export const sender = style({
  display: 'flex',
  gap: '4px',
  alignItems: 'center',
  lineHeight: 1,
});

export const senderIcon = style({
  display: 'inline-flex',
  fontSize: '1rem',
});

export const senderLink = recipe({
  base: {
    'display': 'flex',
    'gap': '4px',
    'alignItems': 'center',
    ':hover': {
      textDecoration: 'underline',
    },
  },
  variants: {
    disabled: {
      true: {
        pointerEvents: 'none',
      },
    },
  },
});

export const senderName = style({
  display: 'flex',
  color: theme.color.token.semantic.textMuted,
});

export const lineClamp = style({
  display: '-webkit-box',
  overflow: 'hidden',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
  lineHeight: 1.25,
  whiteSpace: 'break-spaces',
});
