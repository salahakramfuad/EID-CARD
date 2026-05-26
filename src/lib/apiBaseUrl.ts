/**
 * API origin for Express proxy (dev) or deployed backend.
 * Empty string = same-origin `/api/*` (use Vite dev proxy or reverse proxy in production).
 */
export function getApiBaseUrl(): string {
  const env = import.meta.env.VITE_AI_COLOR_PROXY_URL
  if (typeof env === 'string' && env.trim()) {
    return env.replace(/\/$/, '')
  }
  return ''
}
