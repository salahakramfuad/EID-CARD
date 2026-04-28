import { getFontEmbedCSS, toBlob } from 'html-to-image'
import { CARD_HEIGHT, CARD_WIDTH, type EidCardState } from '../templates/types'
import {
  accentGlowGradient,
  BASE_TINT_GRADIENT,
  CENTER_DARKEN_GRADIENT,
  GLOSS_GRADIENT,
} from './cardBackgroundLayers'

type RenderCardToCanvasArgs = {
  node: HTMLElement
  card: EidCardState
  backgroundSrc: string
  pixelRatio: number
}

async function imageFromSrc(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    if (!src.startsWith('data:')) {
      img.crossOrigin = 'anonymous'
    }
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Background image failed to load'))
    img.src = src
  })
}

async function blobToImage(blob: Blob): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(blob)
  try {
    return await imageFromSrc(url)
  } finally {
    URL.revokeObjectURL(url)
  }
}

function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  width: number,
  height: number,
) {
  const iw = img.naturalWidth || img.width
  const ih = img.naturalHeight || img.height
  const scale = Math.max(width / iw, height / ih)
  const sw = width / scale
  const sh = height / scale
  const sx = (iw - sw) / 2
  const sy = (ih - sh) / 2
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, width, height)
}

async function drawOverlayGradients(ctx: CanvasRenderingContext2D, card: EidCardState): Promise<void> {
  const layers: string[] = [BASE_TINT_GRADIENT, CENTER_DARKEN_GRADIENT, accentGlowGradient(card), GLOSS_GRADIENT]

  for (const background of layers) {
    const layer = document.createElement('div')
    layer.style.cssText = [
      `width:${CARD_WIDTH}px`,
      `height:${CARD_HEIGHT}px`,
      'background-repeat:no-repeat',
      'background-size:100% 100%',
      `background:${background}`,
      'border-radius:36px',
    ].join(';')
    const holder = document.createElement('div')
    holder.style.cssText = 'position:fixed;left:-99999px;top:-99999px;pointer-events:none;'
    holder.appendChild(layer)
    document.body.appendChild(holder)
    try {
      const layerBlob = await toBlob(layer, {
        pixelRatio: 1,
        cacheBust: false,
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        backgroundColor: 'transparent',
      })
      if (!layerBlob) continue
      const img = await blobToImage(layerBlob)
      ctx.drawImage(img, 0, 0, CARD_WIDTH, CARD_HEIGHT)
    } finally {
      holder.remove()
    }
  }
}

export async function renderCardToCanvas({
  node,
  card,
  backgroundSrc,
  pixelRatio,
}: RenderCardToCanvasArgs): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(CARD_WIDTH * pixelRatio)
  canvas.height = Math.round(CARD_HEIGHT * pixelRatio)
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Could not create canvas context')
  ctx.scale(pixelRatio, pixelRatio)

  const bgImage = await imageFromSrc(backgroundSrc)
  drawImageCover(ctx, bgImage, CARD_WIDTH, CARD_HEIGHT)
  await drawOverlayGradients(ctx, card)

  const fontEmbedCSS = await getFontEmbedCSS(node, { cacheBust: false })
  const foregroundBlob = await toBlob(node, {
    pixelRatio: 1,
    cacheBust: false,
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: 'transparent',
    fontEmbedCSS,
    filter: (domNode) => {
      if (domNode instanceof HTMLImageElement && domNode.hasAttribute('data-card-background')) {
        return false
      }
      if (domNode instanceof HTMLElement && domNode.dataset.exportLayer === 'background-overlay') {
        return false
      }
      return true
    },
    style: {
      transform: 'none',
      transformOrigin: 'top left',
    },
  })
  if (!foregroundBlob) throw new Error('Could not render foreground layer')
  const fgImage = await blobToImage(foregroundBlob)
  ctx.drawImage(fgImage, 0, 0, CARD_WIDTH, CARD_HEIGHT)
  return canvas
}

