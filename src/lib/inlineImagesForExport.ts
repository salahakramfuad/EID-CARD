import { blobToDataUrl } from './blobToDataUrl'

function resolveAbsoluteImageUrl(src: string): string {
  if (src.startsWith('data:')) return src
  if (src.startsWith('http://') || src.startsWith('https://')) return src
  return new URL(src, window.location.origin).href
}

async function waitForImageLoad(img: HTMLImageElement, nextSrc: string): Promise<void> {
  img.crossOrigin = 'anonymous'
  await new Promise<void>((resolve, reject) => {
    const done = () => {
      img.removeEventListener('load', done)
      img.removeEventListener('error', onErr)
      if (img.naturalWidth === 0) {
        reject(new Error('Image failed to load'))
        return
      }
      resolve()
    }
    const onErr = () => {
      img.removeEventListener('load', done)
      img.removeEventListener('error', onErr)
      reject(new Error('Image failed to load'))
    }
    img.addEventListener('load', done)
    img.addEventListener('error', onErr)
    img.src = nextSrc
    if (img.complete && img.naturalWidth > 0 && (img.currentSrc || img.src) === nextSrc) {
      img.removeEventListener('load', done)
      img.removeEventListener('error', onErr)
      resolve()
    }
  })
  try {
    await img.decode()
  } catch {
    /* optional */
  }
}

/**
 * Rasterize CSS filter into pixels — iOS WebKit often drops filtered &lt;img&gt;s in html-to-image.
 */
async function bakeCssFilterToDataUrl(img: HTMLImageElement, filter: string): Promise<string | null> {
  const box = img.getBoundingClientRect()
  const w = img.offsetWidth || box.width
  const h = img.offsetHeight || box.height
  if (w < 1 || h < 1 || !filter || filter === 'none') return null

  const scale = 2
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(w * scale)
  canvas.height = Math.round(h * scale)
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  ctx.scale(scale, scale)
  ctx.filter = filter
  ctx.drawImage(img, 0, 0, w, h)
  return canvas.toDataURL('image/png')
}

async function inlineOneImage(
  img: HTMLImageElement,
  cache: Map<string, string>,
  bakeFilter: boolean,
): Promise<void> {
  const current = img.currentSrc || img.src || ''
  if (!current.trim()) return

  if (current.startsWith('data:image') && img.naturalWidth > 0) {
    if (!bakeFilter) return
  } else {
    const resolved = resolveAbsoluteImageUrl(current)
    let dataUrl = cache.get(resolved)
    if (!dataUrl) {
      const res = await fetch(resolved)
      if (!res.ok) throw new Error(`Failed to fetch image: ${resolved}`)
      dataUrl = await blobToDataUrl(await res.blob())
      cache.set(resolved, dataUrl)
    }

    if ((img.currentSrc || img.src) !== dataUrl || img.naturalWidth === 0) {
      await waitForImageLoad(img, dataUrl)
    }
  }

  if (!bakeFilter) return

  const filter = img.style.filter || window.getComputedStyle(img).filter
  if (!filter || filter === 'none') return

  const baked = await bakeCssFilterToDataUrl(img, filter)
  if (!baked) return

  img.style.filter = 'none'
  await waitForImageLoad(img, baked)
}

/**
 * Inline remote/same-origin images as data URLs before html-to-image capture.
 * Required on mobile WebKit so animal art and logos appear in exported PNGs.
 */
export async function inlineImagesForExport(
  root: HTMLElement,
  selector: string,
  cache: Map<string, string>,
  options?: { bakeFilters?: boolean },
): Promise<void> {
  const bakeFilter = options?.bakeFilters ?? false
  const images = root.querySelectorAll<HTMLImageElement>(selector)
  for (const img of images) {
    await inlineOneImage(img, cache, bakeFilter)
  }
}
