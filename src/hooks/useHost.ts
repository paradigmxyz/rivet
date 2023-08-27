import { useQuery } from '@tanstack/react-query'

export function useHost() {
  return useQuery({
    queryKey: ['host'],
    async queryFn() {
      const [tab] = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true,
      })
      if (!tab.url) return null
      return new URL(tab.url).host
    },
  })
}
