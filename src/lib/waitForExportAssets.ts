/**
 * Gate html-to-image / canvas capture until document fonts have settled.
 */
export async function waitForFontsReady(): Promise<void> {
  if (typeof document === 'undefined') return
  try {
    if (document.fonts) {
      await document.fonts.ready
    }
  } catch {
    /* ignore */
  }
}

function waitForImageElement(img: HTMLImageElement): Promise<void> {
  const src = img.currentSrc || img.src || ''
  if (!src.trim()) return Promise.resolve()

  if (img.complete && img.naturalWidth === 0) {
    return Promise.reject(new Error('Image failed to load'))
  }

  const waitLoad = new Promise<void>((resolve, reject) => {
    if (img.complete && img.naturalWidth > 0) {
      resolve()
      return
    }
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
  })

  return waitLoad.then(async () => {
    try {
      await img.decode()
    } catch {
      /* decode optional */
    }
  })
}

/**
 * Ensures every `<img>` under `root` is loaded and decoded (background, logo, etc.).
 */
export async function waitForImagesInElement(root: HTMLElement): Promise<void> {
  const imgs = root.querySelectorAll('img')
  await Promise.all(Array.from(imgs).map((el) => waitForImageElement(el)))
}
