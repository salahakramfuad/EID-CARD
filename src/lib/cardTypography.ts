import { isLightTextColor } from './readableText'

/**
 * Shared type scale for 720×1080 card exports.
 * Shadows adapt to text color so type stays readable on any background photo.
 */
const TITLE_BASE =
  'text-[52px] leading-[1.06] tracking-[-0.038em]'

const MESSAGE_BASE = 'mt-[22px] text-[28px] leading-[1.55] whitespace-pre-wrap'

/** Light-colored text: strong dark glow + crisp edge. */
const TITLE_SHADOW_LIGHT =
  '[text-shadow:0_0_2px_rgba(0,0,0,0.9),0_1px_3px_rgba(0,0,0,0.95),0_4px_16px_rgba(0,0,0,0.65),0_8px_36px_rgba(0,0,0,0.45)]'

/** Dark-colored text: light outline so it pops on shaded photos. */
const TITLE_SHADOW_DARK =
  '[text-shadow:0_0_2px_rgba(255,255,255,0.95),0_1px_2px_rgba(255,255,255,0.7),0_3px_14px_rgba(255,255,255,0.45),0_6px_28px_rgba(0,0,0,0.35)]'

const MESSAGE_SHADOW_LIGHT =
  '[text-shadow:0_0_2px_rgba(0,0,0,0.75),0_1px_3px_rgba(0,0,0,0.88),0_4px_20px_rgba(0,0,0,0.55)]'

const MESSAGE_SHADOW_DARK =
  '[text-shadow:0_0_2px_rgba(255,255,255,0.92),0_1px_2px_rgba(255,255,255,0.55),0_4px_18px_rgba(255,255,255,0.28),0_2px_10px_rgba(0,0,0,0.2)]'

export function cardTitleClass(bold: boolean, textColor: string): string {
  const weight = bold ? 'font-extrabold' : 'font-semibold'
  const shadow = isLightTextColor(textColor) ? TITLE_SHADOW_LIGHT : TITLE_SHADOW_DARK
  return `${TITLE_BASE} ${weight} ${shadow}`
}

export function cardMessageClass(bold: boolean, textColor: string): string {
  const weight = bold ? 'font-semibold' : 'font-normal'
  const shadow = isLightTextColor(textColor) ? MESSAGE_SHADOW_LIGHT : MESSAGE_SHADOW_DARK
  return `${MESSAGE_BASE} ${weight} ${shadow}`
}
