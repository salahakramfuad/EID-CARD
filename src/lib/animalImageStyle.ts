import { isLightTextColor } from './readableText'

/** Makes dark line-art / silhouettes readable on photo backgrounds. */
export function animalArtImageStyle(textColor: string, accentColor: string) {
  const light = isLightTextColor(textColor)
  if (light) {
    return {
      filter: [
        'brightness(0)',
        'invert(1)',
        'contrast(1.12)',
        'drop-shadow(0 6px 28px rgba(0,0,0,0.55))',
        `drop-shadow(0 0 48px ${accentColor}66)`,
      ].join(' '),
    }
  }
  return {
    filter: [
      'brightness(0)',
      'contrast(1.08)',
      'drop-shadow(0 4px 22px rgba(255,255,255,0.35))',
      `drop-shadow(0 0 32px ${accentColor}44)`,
    ].join(' '),
  }
}
