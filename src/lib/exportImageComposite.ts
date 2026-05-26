import { getOffsetWithinAncestor } from './drawAnimalHeroOnCanvas'

const EXPORT_IMAGE_SELECTOR = 'img[data-animal-hero], img[data-school-logo]'

export { EXPORT_IMAGE_SELECTOR }

function parseObjectPosition(
  objectPosition: string,
  dx: number,
  dy: number,
  dw: number,
  dh: number,
  sw: number,
  sh: number,
): { x: number; y: number } {
  const parts = objectPosition.trim().split(/\s+/)
  const xToken = parts[0] ?? 'center'
  const yToken = parts.length > 1 ? parts[1]! : parts[0] ?? 'center'

  let x = dx + (dw - sw) / 2
  let y = dy + (dh - sh) / 2

  if (xToken === 'left' || xToken === '0%') x = dx
  else if (xToken === 'right' || xToken === '100%') x = dx + dw - sw
  else if (xToken.endsWith('%')) {
    const p = Number.parseFloat(xToken) / 100
    if (Number.isFinite(p)) x = dx + (dw - sw) * p
  }

  if (yToken === 'top' || yToken === '0%') y = dy
  else if (yToken === 'bottom' || yToken === '100%') y = dy + dh - sh
  else if (yToken.endsWith('%')) {
    const p = Number.parseFloat(yToken) / 100
    if (Number.isFinite(p)) y = dy + (dh - sh) * p
  }

  return { x, y }
}

function drawObjectFitImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  dx: number,
  dy: number,
  dw: number,
  dh: number,
  objectFit: string,
  objectPosition: string,
): void {
  const nw = img.naturalWidth
  const nh = img.naturalHeight
  if (!nw || !nh) return

  const fit = objectFit === 'cover' ? 'cover' : 'contain'
  const scale =
    fit === 'cover' ? Math.max(dw / nw, dh / nh) : Math.min(dw / nw, dh / nh)
  const sw = nw * scale
  const sh = nh * scale
  const pos = parseObjectPosition(objectPosition, dx, dy, dw, dh, sw, sh)
  ctx.drawImage(img, pos.x, pos.y, sw, sh)
}

async function ensureImageReady(img: HTMLImageElement): Promise<void> {
  if (img.complete && img.naturalWidth > 0) return
  await new Promise<void>((resolve, reject) => {
    const done = () => {
      img.removeEventListener('load', done)
      img.removeEventListener('error', onErr)
      resolve()
    }
    const onErr = () => {
      img.removeEventListener('load', done)
      img.removeEventListener('error', onErr)
      reject(new Error('Export image failed to load'))
    }
    img.addEventListener('load', done)
    img.addEventListener('error', onErr)
    if (img.complete && img.naturalWidth > 0) done()
  })
}

/**
 * Rasterize styled export images (animal + logo) into the card canvas.
 * Uses object-fit/position + CSS filter in an offscreen pass so output matches the preview.
 */
export async function compositeExportImagesOnCanvas(
  ctx: CanvasRenderingContext2D,
  cardNode: HTMLElement,
): Promise<void> {
  const images = cardNode.querySelectorAll<HTMLImageElement>(EXPORT_IMAGE_SELECTOR)

  for (const img of images) {
    try {
      await ensureImageReady(img)
    } catch {
      continue
    }

    const { x, y, width, height } = getOffsetWithinAncestor(img, cardNode)
    if (width < 1 || height < 1) continue

    const computed = window.getComputedStyle(img)
    const filter = img.style.filter || computed.filter
    const objectFit = computed.objectFit || 'contain'
    const objectPosition = computed.objectPosition || '50% 100%'

    const pixelScale = 2
    const raster = document.createElement('canvas')
    raster.width = Math.max(1, Math.round(width * pixelScale))
    raster.height = Math.max(1, Math.round(height * pixelScale))
    const rctx = raster.getContext('2d')
    if (!rctx) continue

    rctx.scale(pixelScale, pixelScale)
    if (filter && filter !== 'none') {
      rctx.filter = filter
    }
    drawObjectFitImage(rctx, img, 0, 0, width, height, objectFit, objectPosition)
    ctx.drawImage(raster, x, y, width, height)
  }
}
