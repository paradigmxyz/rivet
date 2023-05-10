import type { Theme } from '../tokens'

export function getTheme(): {
  storageTheme: Theme | null
  systemTheme: Theme | null
} {
  const storageTheme =
    typeof localStorage !== 'undefined'
      ? (localStorage.getItem('theme') as Theme)
      : null
  const systemTheme =
    // eslint-disable-next-line no-nested-ternary
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-color-scheme: light)').matches
        ? 'light'
        : 'dark'
      : null
  return { storageTheme, systemTheme }
}

export function setTheme(theme: Theme) {
  localStorage.setItem('theme', theme)
  document.documentElement.dataset.theme = theme
}
