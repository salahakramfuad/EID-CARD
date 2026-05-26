/**
 * Paint animal hero &lt;img&gt;s onto the export canvas (bypasses html-to-image on iOS WebKit).
 */
export function drawAnimalHeroImagesOnCanvas(
  ctx: CanvasRenderingContext2D,
  cardNode: HTMLElement,
  previewDisplayScale: number,
): void {
  const scale = previewDisplayScale > 0 ? previewDisplayScale : 1
  const cardRect = cardNode.getBoundingClientRect()
  const heroes = cardNode.querySelectorAll<HTMLImageElement>('img[data-animal-hero]')

  for (const img of heroes) {
    if (!img.complete || img.naturalWidth === 0) continue

    const box = img.getBoundingClientRect()
    const dx = (box.left - cardRect.left) / scale
    const dy = (box.top - cardRect.top) / scale
    const dw = box.width / scale
    const dh = box.height / scale
    if (dw < 1 || dh < 1) continue

    const computed = window.getComputedStyle(img)
    const objectFit = computed.objectFit || 'contain'
    const objectPosition = computed.objectPosition || 'center bottom'

    drawObjectFitImage(ctx, img, dx, dy, dw, dh, objectFit, objectPosition)
  }
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
  const yToken = parts[1] ?? parts[0] ?? 'center'

  let x = dx + (dw - sw) / 2
  let y = dy + (dh - sh) / 2

  if (xToken === 'left' || xToken === '0%') x = dx
  else if (xToken === 'right' || xToken === '100%') x = dx + dw - sw
  else if (xToken.endsWith('%')) {
    const p = Number.parseFloat(xToken) / 100
    x = dx + (dw - sw) * p
  }

  if (yToken === 'top' || yToken === '0%') y = dy
  else if (yToken === 'bottom' || yToken === '100%') y = dy + dh - sh
  else if (yToken.endsWith('%')) {
    const p = Number.parseFloat(yToken) / 100
    y = dy + (dh - sh) * p
  }

  return { x, y }
}
