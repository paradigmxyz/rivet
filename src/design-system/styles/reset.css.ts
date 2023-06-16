import { globalStyle, layer, style } from '@vanilla-extract/css'

const reset = layer('reset')

globalStyle('a', {
  textDecoration: 'none',
  color: 'inherit',
})

export const resetBase = style({
  '@layer': {
    [reset]: {
      margin: 0,
      padding: 0,
      border: 0,
      boxSizing: 'border-box',
      fontSize: '100%',
      font: 'inherit',
      verticalAlign: 'baseline',
      transition: '0.1s ease',
    },
  },
})

const list = style({
  '@layer': { [reset]: { listStyle: 'none' } },
})

const table = style({
  '@layer': { [reset]: { borderCollapse: 'collapse', borderSpacing: 0 } },
})

const appearanceNone = style({
  '@layer': { [reset]: { appearance: 'none' } },
})

const backgroundTransparent = style({
  '@layer': { [reset]: { backgroundColor: 'transparent' } },
})

const button = style([
  backgroundTransparent,
  {
    '@layer': { [reset]: { color: 'unset', cursor: 'default' } },
  },
])

const field = [appearanceNone, backgroundTransparent]

const quotes = style({
  '@layer': {
    [reset]: {
      quotes: 'none',
      selectors: {
        '&:before, &:after': {
          content: ["''", 'none'],
        },
      },
    },
  },
})

const select = style([
  field,
  {
    '@layer': {
      [reset]: {
        ':disabled': {
          opacity: 1,
        },
        selectors: {
          '&::-ms-expand': {
            display: 'none',
          },
        },
      },
    },
  },
])

const input = style([
  field,
  style({
    '@layer': {
      [reset]: {
        selectors: {
          '&:focus-visible': {
            outline: 'none',
          },
          '&::-ms-clear': {
            display: 'none',
          },
          '&::-webkit-search-cancel-button': {
            WebkitAppearance: 'none',
          },
        },
      },
    },
  }),
])

export const resetElements = {
  blockquote: quotes,
  button,
  input,
  ol: list,
  q: quotes,
  select,
  table,
  ul: list,
}
