import type { IslamicCardVariant } from './islamicCardLayout'
import type { TemplateId } from './types'

export const ISLAMIC_VARIANTS: Record<TemplateId, IslamicCardVariant> = {
  cow: {
    patternPrefix: 'cow',
    animal: 'cow',
    defaultAccent: '#d27d2d',
    bandOpacity: 0.28,
    divider: 'full',
    frameOpacity: 0.14,
    skylineOpacity: 0,
    showLanterns: false,
  },
  goat: {
    patternPrefix: 'goat',
    animal: 'goat',
    defaultAccent: '#34d399',
    bandOpacity: 0.28,
    divider: 'full',
    frameOpacity: 0.14,
    skylineOpacity: 0,
    showLanterns: false,
  },
  camel: {
    patternPrefix: 'camel',
    animal: 'camel',
    defaultAccent: '#f59e0b',
    bandOpacity: 0.28,
    divider: 'full',
    frameOpacity: 0.14,
    skylineOpacity: 0,
    showLanterns: false,
  },
}

export function getIslamicVariantForTemplate(templateId: TemplateId): IslamicCardVariant {
  return ISLAMIC_VARIANTS[templateId] ?? ISLAMIC_VARIANTS.cow
}
