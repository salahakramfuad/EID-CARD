/**
 * Detect whether a CSS color reads as "light" on the card so we can pick
 * a contrasting text-shadow (dark halo vs light halo).
 */
export function isLightTextColor(cssColor: string): boolean {
  const rgb = parseCssColorToRgb(cssColor)
  if (!rgb) return true
  const [r, g, b] = rgb
  const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
  return lum > LCUT
}

/** Below this relative luminance we treat text as dark and use a light outline glow. */
const LCUT = 0.45

function parseCssColorToRgb(input: string): [number, number, number] | null {
  const c = input.trim()
  if (!c) return null

  let m = c.match(/^#([a-f\d]{3})$/i)
  if (m) {
    const x = m[1]
    return [parseInt(x[0] + x[0], 16), parseInt(x[1] + x[1], 16), parseInt(x[2] + x[2], 16)]
  }
  m = c.match(/^#([a-f\d]{6})$/i)
  if (m) {
    const x = m[1]
    return [parseInt(x.slice(0, 2), 16), parseInt(x.slice(2, 4), 16), parseInt(x.slice(4, 6), 16)]
  }

  m = c.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i)
  if (m) {
    return [clampByte(+m[1]), clampByte(+m[2]), clampByte(+m[3])]
  }

  if (c.toLowerCase() === 'white' || c === '#fff' || c === '#ffffff') return [255, 255, 255]
  if (c.toLowerCase() === 'black' || c === '#000' || c === '#000000') return [0, 0, 0]

  return null
}

function clampByte(n: number) {
  return Math.max(0, Math.min(255, Math.round(n)))
}
