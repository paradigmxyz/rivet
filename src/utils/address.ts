export function truncateAddress(address: string) {
  return `${address.slice(0, 8)}\u2026${address.slice(-6)}`
}
