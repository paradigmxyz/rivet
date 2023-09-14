export function truncate(
  str: string,
  { start = 8, end = 6 }: { start?: number; end?: number } = {},
) {
  if (str.length <= start + end) return str
  return `${str.slice(0, start)}\u2026${str.slice(-end)}`
}
