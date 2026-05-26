/** Sum offsetLeft/Top from `element` up to `ancestor` (720×1080 card space). */
export function getOffsetWithinAncestor(
  element: HTMLElement,
  ancestor: HTMLElement,
): { x: number; y: number; width: number; height: number } {
  let x = 0
  let y = 0
  let el: HTMLElement | null = element

  while (el && el !== ancestor) {
    x += el.offsetLeft
    y += el.offsetTop
    el = el.offsetParent as HTMLElement | null
  }

  return {
    x,
    y,
    width: element.offsetWidth,
    height: element.offsetHeight,
  }
}

/**
 * Paint animal hero &lt;img&gt;s onto the export canvas (bypasses html-to-image on iOS WebKit).
 * Uses layout coordinates + CSS object-fit so export matches the preview.
 */
export function drawAnimalHeroImagesOnCanvas(
  ctx: CanvasRenderingContext2D,
  cardNode: HTMLElement,
): void {
  const heroes = cardNode.querySelectorAll<HTMLImageElement>('img[data-animal-hero]')

  for (const img of heroes) {
    if (!img.complete || img.naturalWidth === 0) continue

    const { x, y, width, height } = getOffsetWithinAncestor(img, cardNode)
    if (width < 1 || height < 1) continue

    const computed = window.getComputedStyle(img)
    const objectFit = computed.objectFit || 'contain'
    const objectPosition = computed.objectPosition || '50% 100%'
    const filter = img.style.filter || computed.filter

    ctx.save()
    if (filter && filter !== 'none') {
      ctx.filter = filter
    }
    drawObjectFitImage(ctx, img, x, y, width, height, objectFit, objectPosition)
    ctx.restore()
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
