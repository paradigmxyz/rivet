export function isDomain(value: string): boolean {
  return /^.*\.[a-zA-Z]{2,}$/i.test(value)
}
