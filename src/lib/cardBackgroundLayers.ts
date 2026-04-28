import type { EidCardState } from '../templates/types'

export const BASE_TINT_GRADIENT =
  'linear-gradient(165deg, rgba(6,10,18,0.5) 0%, rgba(5,9,16,0.38) 32%, rgba(4,8,14,0.4) 52%, rgba(5,10,18,0.52) 100%)'

export const CENTER_DARKEN_GRADIENT =
  'radial-gradient(ellipse 96% 72% at 50% 42%, rgba(0,0,0,0.32) 0%, rgba(0,0,0,0.08) 52%, transparent 72%)'

export const GLOSS_GRADIENT =
  'linear-gradient(to bottom, rgba(255,255,255,0.05) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.12) 100%)'

export function accentGlowGradient(card: EidCardState): string {
  return `radial-gradient(78% 44% at 50% 36%, ${card.accentColor}26 0%, transparent 72%)`
}

