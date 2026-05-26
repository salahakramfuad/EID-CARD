import { getApiBaseUrl } from './apiBaseUrl'

/** Shown before any tracked downloads are stored on the server. */
export const DOWNLOAD_COUNT_BASE = 75

export async function fetchDownloadCount(): Promise<number> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/api/downloads`)
    if (!res.ok) return DOWNLOAD_COUNT_BASE
    const data = (await res.json()) as { count?: unknown }
    return typeof data.count === 'number' && Number.isFinite(data.count)
      ? Math.max(DOWNLOAD_COUNT_BASE, Math.floor(data.count))
      : DOWNLOAD_COUNT_BASE
  } catch {
    return DOWNLOAD_COUNT_BASE
  }
}

/** Call after a successful PNG export; returns the new total count. */
export async function recordDownload(): Promise<number> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/api/downloads`, { method: 'POST' })
    if (!res.ok) return DOWNLOAD_COUNT_BASE
    const data = (await res.json()) as { count?: unknown }
    return typeof data.count === 'number' && Number.isFinite(data.count)
      ? Math.max(DOWNLOAD_COUNT_BASE, Math.floor(data.count))
      : DOWNLOAD_COUNT_BASE
  } catch {
    return DOWNLOAD_COUNT_BASE
  }
}
