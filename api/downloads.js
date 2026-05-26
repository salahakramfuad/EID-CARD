import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const DOWNLOAD_COUNT_BASE = 75
const STATS_FILE = join('/tmp', 'eid-card-download-stats.json')

async function readIncrement() {
  try {
    const raw = await readFile(STATS_FILE, 'utf8')
    const data = JSON.parse(raw)
    const n = data?.increment
    return typeof n === 'number' && Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0
  } catch {
    return 0
  }
}

async function writeIncrement(increment) {
  await mkdir('/tmp', { recursive: true }).catch(() => {})
  await writeFile(STATS_FILE, JSON.stringify({ increment }, null, 2), 'utf8')
}

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

/** Vercel serverless + local `vercel dev` — global download counter API. */
export default async function handler(req, res) {
  setCors(res)

  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }

  try {
    if (req.method === 'GET') {
      const increment = await readIncrement()
      res.status(200).json({ count: DOWNLOAD_COUNT_BASE + increment })
      return
    }

    if (req.method === 'POST') {
      const increment = (await readIncrement()) + 1
      await writeIncrement(increment)
      res.status(200).json({ count: DOWNLOAD_COUNT_BASE + increment })
      return
    }

    res.status(405).json({ error: 'Method not allowed' })
  } catch {
    res.status(500).json({ error: 'Could not update download count' })
  }
}
