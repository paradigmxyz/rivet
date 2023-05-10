import chroma from 'chroma-js'

export function toRgb(color: string) {
  const [r, g, b, a] = chroma(color).rgba()
  return `${r} ${g} ${b}${a !== 1 ? ` / ${a}` : ''}`
}
