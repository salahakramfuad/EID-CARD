import express from 'express'
import cors from 'cors'
import fs from 'node:fs/promises'
import path from 'node:path'
import OpenAI from 'openai'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json({ limit: '12mb' }))

const PORT = Number(process.env.PORT ?? 3001)
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const isDummyKey = !OPENAI_API_KEY || OPENAI_API_KEY === 'DUMMY' || OPENAI_API_KEY === 'dummy'
const openai = !isDummyKey ? new OpenAI({ apiKey: OPENAI_API_KEY }) : null

const cache = new Map()

/** Public total starts here; server stores additional increments only. */
const DOWNLOAD_COUNT_BASE = 75
const STATS_PATH = path.join(process.cwd(), 'server', 'data', 'stats.json')

async function readDownloadIncrement() {
  try {
    const raw = await fs.readFile(STATS_PATH, 'utf8')
    const data = JSON.parse(raw)
    const n = data?.increment
    return typeof n === 'number' && Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0
  } catch {
    return 0
  }
}

async function writeDownloadIncrement(increment) {
  await fs.mkdir(path.dirname(STATS_PATH), { recursive: true })
  await fs.writeFile(STATS_PATH, JSON.stringify({ increment }, null, 2), 'utf8')
}

function isHexColor(v) {
  return typeof v === 'string' && /^#[0-9a-fA-F]{6}$/.test(v)
}

app.get('/api/downloads', async (_req, res) => {
  try {
    const increment = await readDownloadIncrement()
    res.json({ count: DOWNLOAD_COUNT_BASE + increment })
  } catch {
    res.status(500).json({ error: 'Could not read download count' })
  }
})

app.post('/api/downloads', async (_req, res) => {
  try {
    const increment = (await readDownloadIncrement()) + 1
    await writeDownloadIncrement(increment)
    res.json({ count: DOWNLOAD_COUNT_BASE + increment })
  } catch {
    res.status(500).json({ error: 'Could not update download count' })
  }
})

app.post('/api/ai-color', async (req, res) => {
  try {
    const { backgroundId, templateId, backgroundImageBase64 } = req.body ?? {}

    const validPresetBackgroundIds = new Set(['bg1', 'bg2', 'bg3', 'bg4'])
    const validTemplateIds = new Set(['cow', 'goat', 'camel'])

    const isCustom = backgroundId === 'custom'
    if (
      (!validPresetBackgroundIds.has(backgroundId) && !isCustom) ||
      !validTemplateIds.has(templateId)
    ) {
      res.status(400).json({ error: 'Invalid backgroundId or templateId' })
      return
    }

    if (isCustom && (typeof backgroundImageBase64 !== 'string' || backgroundImageBase64.length < 64)) {
      res.status(400).json({ error: 'Missing backgroundImageBase64 for custom background' })
      return
    }

    const cacheKey = isCustom
      ? `custom:${backgroundImageBase64.slice(0, 96)}:${templateId}`
      : `${backgroundId}:${templateId}`
    const cached = cache.get(cacheKey)
    if (cached) {
      res.json(cached)
      return
    }

    if (!openai) {
      res.status(503).json({ error: 'Missing OPENAI_API_KEY' })
      return
    }

    let base64
    if (isCustom) {
      base64 = backgroundImageBase64
    } else {
      const imgPath = path.join(process.cwd(), 'public', `${backgroundId}.png`)
      const buf = await fs.readFile(imgPath)
      base64 = buf.toString('base64')
    }

    const prompt = `BackgroundId=${backgroundId}, TemplateStyle=${templateId}.

Pick best-looking and readable colors for this card theme:
- textColor: high-contrast against the background for the main title/message/signature.
- accentColor: complementary accent for divider bars and ornament strokes (should visually match the template style).

Return ONLY valid JSON in this shape:
{ "textColor": "#RRGGBB", "accentColor": "#RRGGBB" }`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.2,
      max_tokens: 120,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: 'You are a professional graphic designer.' },
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: `data:image/png;base64,${base64}` } },
          ],
        },
      ],
    })

    const content = completion.choices?.[0]?.message?.content ?? ''

    let textColor
    let accentColor
    try {
      const parsed = JSON.parse(content)
      textColor = parsed.textColor
      accentColor = parsed.accentColor
    } catch {
      // Fallback: extract the first two hex colors from any extra text.
      const matches = content.match(/#[0-9a-fA-F]{6}/g) ?? []
      textColor = matches[0]
      accentColor = matches[1]
    }

    if (!isHexColor(textColor) || !isHexColor(accentColor)) {
      res.status(500).json({ error: 'AI returned invalid colors' })
      return
    }

    const payload = { textColor, accentColor }
    cache.set(cacheKey, payload)
    res.json(payload)
  } catch (err) {
    res.status(500).json({ error: 'AI palette generation failed' })
  }
})

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[eid-card-api] listening on :${PORT}`)
})

