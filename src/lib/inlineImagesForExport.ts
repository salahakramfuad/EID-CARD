import { blobToDataUrl } from './blobToDataUrl'

function resolveAbsoluteImageUrl(src: string): string {
  if (src.startsWith('data:')) return src
  if (src.startsWith('http://') || src.startsWith('https://')) return src
  return new URL(src, window.location.origin).href
}

async function waitForImageLoad(img: HTMLImageElement, nextSrc: string): Promise<void> {
  if (!nextSrc.startsWith('data:')) {
    img.crossOrigin = 'anonymous'
  }
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

async function inlineOneImage(img: HTMLImageElement, cache: Map<string, string>): Promise<void> {
  const current = img.currentSrc || img.src || ''
  if (!current.trim()) return
  if (current.startsWith('data:image') && img.naturalWidth > 0) return

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

type ImageSnapshot = {
  img: HTMLImageElement
  src: string
  styleFilter: string
}

/**
 * Inline images as data URLs for export, then restore the live preview when done.
 * Does not bake filters (that distorted object-fit and changed animal shape on screen).
 */
export async function prepareImagesForExport(
  root: HTMLElement,
  selector: string,
  cache: Map<string, string>,
): Promise<() => void> {
  const snapshots: ImageSnapshot[] = []
  const images = root.querySelectorAll<HTMLImageElement>(selector)

  for (const img of images) {
    snapshots.push({
      img,
      src: img.currentSrc || img.src,
      styleFilter: img.style.filter,
    })
    await inlineOneImage(img, cache)
  }

  return () => {
    for (const { img, src, styleFilter } of snapshots) {
      img.style.filter = styleFilter
      const current = img.currentSrc || img.src
      if (current !== src) {
        img.src = src
      }
    }
  }
}
