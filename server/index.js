import express from 'express'
import cors from 'cors'
import fs from 'node:fs/promises'
import path from 'node:path'
import OpenAI from 'openai'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json({ limit: '1mb' }))

const PORT = Number(process.env.PORT ?? 3001)
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const isDummyKey = !OPENAI_API_KEY || OPENAI_API_KEY === 'DUMMY' || OPENAI_API_KEY === 'dummy'
const openai = !isDummyKey ? new OpenAI({ apiKey: OPENAI_API_KEY }) : null

const cache = new Map()

function isHexColor(v) {
  return typeof v === 'string' && /^#[0-9a-fA-F]{6}$/.test(v)
}

app.post('/api/ai-color', async (req, res) => {
  try {
    const { backgroundId, templateId } = req.body ?? {}

    const validBackgroundIds = new Set(['bg1', 'bg2', 'bg3', 'bg4'])
    const validTemplateIds = new Set([
      'modern',
      'islamic',
      'minimal',
      'colorful',
      'elegant',
      'festive',
      'royal',
      'moonlight',
    ])

    if (!validBackgroundIds.has(backgroundId) || !validTemplateIds.has(templateId)) {
      res.status(400).json({ error: 'Invalid backgroundId or templateId' })
      return
    }

    const cacheKey = `${backgroundId}:${templateId}`
    const cached = cache.get(cacheKey)
    if (cached) {
      res.json(cached)
      return
    }

    if (!openai) {
      res.status(503).json({ error: 'Missing OPENAI_API_KEY' })
      return
    }

    const imgPath = path.join(process.cwd(), 'public', `${backgroundId}.png`)
    const buf = await fs.readFile(imgPath)
    const base64 = buf.toString('base64')

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
  console.log(`[ai-color-proxy] listening on :${PORT}`)
})

