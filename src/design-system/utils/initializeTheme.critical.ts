import { getTheme } from './theme'

const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

const { storageTheme, systemTheme } = getTheme()
const theme = storageTheme || systemTheme || 'dark'

document.documentElement.dataset.theme = theme

if (!storageTheme) {
  // Update the theme if the user changes their OS preference
  darkModeMediaQuery.addEventListener('change', ({ matches: isDark }) => {
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light'
  })
}
