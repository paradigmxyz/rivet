import { colorSchemeForThemeClass } from '../styles/theme.css'

export function initializeTheme() {
  // Set the initial color contexts to match their respective themes
  document.body.classList.add(
    colorSchemeForThemeClass.light.light,
    colorSchemeForThemeClass.dark.dark,
  )
}
