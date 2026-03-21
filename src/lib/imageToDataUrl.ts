const cache = new Map<string, Promise<string>>()

function isDataUrl(url: string) {
  return /^data:/.test(url)
}

export async function imageToDataUrl(url: string): Promise<string> {
  if (isDataUrl(url)) return url
  const cached = cache.get(url)
  if (cached) return cached

  const promise = (async () => {
    const res = await fetch(url, { mode: 'cors' })
    if (!res.ok) {
      throw new Error(`Failed to fetch image: ${res.status} ${url}`)
    }
    const blob = await res.blob()

    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onerror = () => reject(new Error('Failed to read image blob'))
      reader.onloadend = () => resolve(String(reader.result))
      reader.readAsDataURL(blob)
    })
  })()

  cache.set(url, promise)
  return promise
}

