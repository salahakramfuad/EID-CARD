export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Could not read blob as data URL'))
      }
    }
    reader.onerror = () => reject(new Error('Could not read blob as data URL'))
    reader.readAsDataURL(blob)
  })
}
