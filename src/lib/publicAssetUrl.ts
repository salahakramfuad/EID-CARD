/**
 * Vite `base` (e.g. `/` or `/subdir/`) + public file path from project root `public/`.
 * Use for `/bg1.png`-style assets so subpath deploys still resolve.
 */
export function publicAssetUrl(path: string): string {
  const clean = path.replace(/^\//, '')
  const base = import.meta.env.BASE_URL
  if (base === '/') return `/${clean}`
  return `${base.replace(/\/$/, '')}/${clean}`
}
