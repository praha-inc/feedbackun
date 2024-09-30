import { globalStyle } from '@vanilla-extract/css';

import { theme } from './theme.css';

globalStyle(':root', {
  '@media': {
    '(prefers-color-scheme: light)': {
      vars: {
        [theme.color.palette.black]: '#1f2328',
        [theme.color.palette.white]: '#ffffff',

        [theme.color.palette.gray50]: '#f6f8fa',
        [theme.color.palette.gray100]: '#eaeef2',
        [theme.color.palette.gray200]: '#d0d7de',
        [theme.color.palette.gray300]: '#afb8c1',
        [theme.color.palette.gray400]: '#8c959f',
        [theme.color.palette.gray500]: '#6e7781',
        [theme.color.palette.gray600]: '#57606a',
        [theme.color.palette.gray700]: '#424a53',
        [theme.color.palette.gray800]: '#32383f',
        [theme.color.palette.gray900]: '#24292f',

        [theme.color.palette.red50]: '#ffebe9',
        [theme.color.palette.red100]: '#ffcecb',
        [theme.color.palette.red200]: '#ffaba8',
        [theme.color.palette.red300]: '#ff8182',
        [theme.color.palette.red400]: '#fa4549',
        [theme.color.palette.red500]: '#cf222e',
        [theme.color.palette.red600]: '#a40e26',
        [theme.color.palette.red700]: '#82071e',
        [theme.color.palette.red800]: '#660018',
        [theme.color.palette.red900]: '#4c0014',

        [theme.color.palette.green50]: '#dafbe1',
        [theme.color.palette.green100]: '#aceebb',
        [theme.color.palette.green200]: '#6fdd8b',
        [theme.color.palette.green300]: '#4ac26b',
        [theme.color.palette.green400]: '#2da44e',
        [theme.color.palette.green500]: '#1a7f37',
        [theme.color.palette.green600]: '#116329',
        [theme.color.palette.green700]: '#044f1e',
        [theme.color.palette.green800]: '#003d16',
        [theme.color.palette.green900]: '#002d11',

        [theme.color.palette.blue50]: '#ddf4ff',
        [theme.color.palette.blue100]: '#b6e3ff',
        [theme.color.palette.blue200]: '#80ccff',
        [theme.color.palette.blue300]: '#54aeff',
        [theme.color.palette.blue400]: '#218bff',
        [theme.color.palette.blue500]: '#0969da',
        [theme.color.palette.blue600]: '#0550ae',
        [theme.color.palette.blue700]: '#033d8b',
        [theme.color.palette.blue800]: '#0a3069',
        [theme.color.palette.blue900]: '#002155',

        [theme.color.palette.yellow50]: '#fff8c5',
        [theme.color.palette.yellow100]: '#fae17d',
        [theme.color.palette.yellow200]: '#eac54f',
        [theme.color.palette.yellow300]: '#d4a72c',
        [theme.color.palette.yellow400]: '#bf8700',
        [theme.color.palette.yellow500]: '#9a6700',
        [theme.color.palette.yellow600]: '#7d4e00',
        [theme.color.palette.yellow700]: '#633c01',
        [theme.color.palette.yellow800]: '#4d2d00',
        [theme.color.palette.yellow900]: '#3b2300',

        [theme.color.token.semantic.text]: theme.color.palette.black,
        [theme.color.token.semantic.textMuted]: theme.color.palette.gray600,
        [theme.color.token.semantic.background]: theme.color.palette.white,
        [theme.color.token.semantic.backgroundMuted]: theme.color.palette.gray200,
        [theme.color.token.semantic.backgroundInset]: theme.color.palette.gray50,
        [theme.color.token.semantic.border]: theme.color.palette.gray200,
        [theme.color.token.semantic.borderMuted]: theme.color.palette.gray100,
        [theme.color.token.semantic.overlay]: `color-mix(in srgb, ${theme.color.palette.gray100} 48%, transparent)`,
        [theme.color.token.semantic.shadow]: `color-mix(in srgb, ${theme.color.palette.gray700} 16%, transparent)`,
      },
    },
  },
});
