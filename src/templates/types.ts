import type { ReactNode } from 'react'

// Portrait design canvas: all template coordinates and exported PNG use this space.
export const CARD_WIDTH = 720
export const CARD_HEIGHT = 1080

export type TemplateId = 'cow' | 'goat' | 'camel'

export type AdhaAnimalKind = TemplateId

export type PresetBackgroundId = 'bg1' | 'bg2' | 'bg3' | 'bg4'
export type BackgroundId = PresetBackgroundId | 'custom'

export type TextDecorations = {
  stars: boolean
  moons: boolean
  sparkles: boolean
}

export type LogoState = {
  dataUrl: string
  /**
   * Top-left placement in card pixel space (0..CARD_WIDTH/CARD_HEIGHT range is expected).
   */
  x: number
  y: number
  /**
   * Logo width in pixels. Height is derived from the intrinsic aspect ratio.
   */
  widthPx: number
  /**
   * heightPx = widthPx * aspectRatio
   */
  aspectRatio: number
  placement: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

export type EidCardState = {
  templateId: TemplateId
  backgroundId: BackgroundId
  /** User-uploaded full-bleed background when `backgroundId` is `custom`. */
  customBackgroundDataUrl: string | null

  title: string
  message: string
  userName: string
  designation: string

  textColor: string
  /**
   * Accent color used for ornaments, divider bars, and template strokes.
   * (Different from `textColor` when AI palette selection is enabled.)
   */
  accentColor: string
  /**
   * If enabled, we will auto-pick a text color that has good contrast
   * with the selected background.
   */
  autoTextColor: boolean
  fontId: string
  fontFamily: string
  /** Heavier title, message, and name when enabled. */
  boldText: boolean

  decorations: TextDecorations
  logo: LogoState
}

export type EidTemplate = {
  id: TemplateId
  name: string
  styleKey: TemplateId
  description: string
  /**
   * Used in the template picker sidebar.
   */
  thumbnail: (active: boolean) => ReactNode
  /**
   * Used in preview/export.
   */
  render: (card: EidCardState) => ReactNode
  /**
   * Optional canvas renderer for fully deterministic export on devices where
   * DOM snapshotting can be flaky (not required for all templates immediately).
   */
  renderToCanvas?: (ctx: CanvasRenderingContext2D, card: EidCardState) => void | Promise<void>
}

