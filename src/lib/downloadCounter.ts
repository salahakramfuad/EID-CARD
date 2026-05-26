import { getApiBaseUrl } from './apiBaseUrl'

/** Shown before any tracked downloads are stored on the server. */
export const DOWNLOAD_COUNT_BASE = 75

const LOCAL_INCREMENT_KEY = 'eid-card-download-increment'

function readLocalIncrement(): number {
  try {
    const raw = localStorage.getItem(LOCAL_INCREMENT_KEY)
    const n = raw === null ? 0 : Number.parseInt(raw, 10)
    return Number.isFinite(n) && n >= 0 ? n : 0
  } catch {
    return 0
  }
}

function writeLocalIncrement(increment: number) {
  try {
    localStorage.setItem(LOCAL_INCREMENT_KEY, String(Math.max(0, Math.floor(increment))))
  } catch {
    /* private mode / blocked storage */
  }
}

function parseCountPayload(data: unknown): number | null {
  if (typeof data !== 'object' || data === null) return null
  const count = (data as { count?: unknown }).count
  if (typeof count !== 'number' || !Number.isFinite(count)) return null
  return Math.max(DOWNLOAD_COUNT_BASE, Math.floor(count))
}

export async function fetchDownloadCount(): Promise<number> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/api/downloads`, { cache: 'no-store' })
    if (res.ok) {
      const count = parseCountPayload(await res.json())
      if (count !== null) {
        writeLocalIncrement(count - DOWNLOAD_COUNT_BASE)
        return count
      }
    }
  } catch {
    /* API unavailable — use local tally */
  }
  return DOWNLOAD_COUNT_BASE + readLocalIncrement()
}

/** Call after a successful PNG export; returns the new total count. */
export async function recordDownload(): Promise<number> {
  const nextLocal = readLocalIncrement() + 1
  writeLocalIncrement(nextLocal)

  try {
    const res = await fetch(`${getApiBaseUrl()}/api/downloads`, {
      method: 'POST',
      cache: 'no-store',
    })
    if (res.ok) {
      const count = parseCountPayload(await res.json())
      if (count !== null) {
        writeLocalIncrement(count - DOWNLOAD_COUNT_BASE)
        return count
      }
    }
  } catch {
    /* keep local increment */
  }

  return DOWNLOAD_COUNT_BASE + nextLocal
}
