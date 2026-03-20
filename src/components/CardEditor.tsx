import { useEffect, useMemo, useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import Preview from './Preview'
import ControlsPanel from './ControlsPanel'
import TemplateSelector from './TemplateSelector'
import { fontOptions } from '../lib/fonts'
import { presetEidMessages } from '../lib/eidMessages'
import { templates } from '../templates/registry'
import type { BackgroundId, EidCardState, LogoState, TemplateId } from '../templates/types'
import { CARD_HEIGHT, CARD_WIDTH } from '../templates/types'

const DEFAULT_TEXT_COLOR = '#ffffff'
const DEFAULT_ACCENT_COLOR = DEFAULT_TEXT_COLOR
const DEFAULT_LOGO_WIDTH_PX = 120
const LOGO_PADDING_TOP_PX = 36
const LOGO_PADDING_BOTTOM_PX = 40
const LOGO_PADDING_LEFT_RIGHT_PX = 54

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function getDefaultLogoPosition(
  placement: LogoState['placement'],
  widthPx: number,
  aspectRatio: number,
) {
  const x =
    placement === 'top-left' || placement === 'bottom-left'
      ? LOGO_PADDING_LEFT_RIGHT_PX
      : CARD_WIDTH - LOGO_PADDING_LEFT_RIGHT_PX - widthPx

  const heightPx = Math.round(widthPx * aspectRatio)
  const y =
    placement === 'top-left' || placement === 'top-right'
      ? LOGO_PADDING_TOP_PX
      : CARD_HEIGHT - LOGO_PADDING_BOTTOM_PX - heightPx

  return { x: clamp(x, 0, CARD_WIDTH - widthPx), y: clamp(y, 0, CARD_HEIGHT - heightPx) }
}

function recommendTextColorFromBackgroundId(backgroundId: BackgroundId): Promise<string> {
  const url = `/${backgroundId}.png`
  return new Promise<string>((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve(DEFAULT_TEXT_COLOR)
        return
      }

      // Small sample for speed; we just need average brightness.
      const sampleW = 40
      const sampleH = 60
      canvas.width = sampleW
      canvas.height = sampleH
      ctx.drawImage(img, 0, 0, sampleW, sampleH)
      const { data } = ctx.getImageData(0, 0, sampleW, sampleH)

      let sum = 0
      // Average luminance (perceived brightness).
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
        sum += luminance
      }
      const avg = sum / (data.length / 4)
      resolve(avg > 0.55 ? '#0b0b0b' : '#ffffff')
    }
    img.onerror = () => resolve(DEFAULT_TEXT_COLOR)
    img.src = url
  })
}

async function requestAiPalette(
  backgroundId: BackgroundId,
  templateId: TemplateId,
): Promise<{ textColor: string; accentColor: string }> {
  const baseUrl = import.meta.env.VITE_AI_COLOR_PROXY_URL ?? 'http://localhost:3001'
  const res = await fetch(`${baseUrl}/api/ai-color`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ backgroundId, templateId }),
  })

  if (!res.ok) {
    throw new Error(`AI palette request failed: ${res.status}`)
  }

  const data = (await res.json()) as unknown
  if (
    typeof (data as any)?.textColor !== 'string' ||
    typeof (data as any)?.accentColor !== 'string'
  ) {
    throw new Error('AI palette response missing colors')
  }

  return { textColor: (data as any).textColor, accentColor: (data as any).accentColor }
}

export default function CardEditor() {
  const cardRef = useRef<HTMLDivElement>(null)
  const hasAskedNameRef = useRef(false)
  const aiPaletteCacheRef = useRef<Map<string, { textColor: string; accentColor: string }>>(new Map())

  const initialFont = fontOptions[0]
  const initialPreset = presetEidMessages[0]

  const [darkMode, setDarkMode] = useState(false)
  const [enableLogoDrag, setEnableLogoDrag] = useState(true)
  const [selectedMessagePresetId, setSelectedMessagePresetId] = useState(initialPreset.id)
  const [logoCustomPosition, setLogoCustomPosition] = useState(false)
  const [showNameModal, setShowNameModal] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const [previewScale, setPreviewScale] = useState(0.8)

  const [card, setCard] = useState<EidCardState>(() => {
    const font = initialFont
    const defaultPlacement: LogoState['placement'] = 'bottom-right'
    const defaultPos = getDefaultLogoPosition(defaultPlacement, DEFAULT_LOGO_WIDTH_PX, 1)
    const defaultBackgroundId: BackgroundId = 'bg1'
    const base: EidCardState = {
      templateId: 'modern',
      backgroundId: defaultBackgroundId,
      title: 'Eid Mubarak',
      message: initialPreset.message,
      userName: 'Your Name',
      textColor: DEFAULT_TEXT_COLOR,
      accentColor: DEFAULT_ACCENT_COLOR,
      autoTextColor: false,
      fontId: font.id,
      fontFamily: font.familyCss,
      decorations: { stars: true, moons: false, sparkles: true },
      logo: {
        // Use the permanent default logo from `public/School_logo.png`.
        dataUrl: '/School_logo.png',
        x: defaultPos.x,
        y: defaultPos.y,
        widthPx: DEFAULT_LOGO_WIDTH_PX,
        aspectRatio: 1,
        placement: defaultPlacement,
      },
    }

    return base
  })

  // Load the selected Google Font for accurate preview/export.
  useEffect(() => {
    const font = fontOptions.find((f) => f.id === card.fontId) ?? initialFont

    let link = document.getElementById('google-font-link') as HTMLLinkElement | null
    if (!link) {
      link = document.createElement('link')
      link.id = 'google-font-link'
      link.rel = 'stylesheet'
      document.head.appendChild(link)
    }
    link.href = font.href
  }, [card.fontId, initialFont])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  useEffect(() => {
    function updatePreviewScale() {
      const vw = window.innerWidth
      if (vw < 640) {
        // Fit preview nicely on phones while keeping it readable.
        const fit = (vw - 26) / CARD_WIDTH
        setPreviewScale(clamp(fit, 0.42, 0.60))
        return
      }
      if (vw < 1024) {
        setPreviewScale(0.72)
        return
      }
      setPreviewScale(0.8)
    }

    updatePreviewScale()
    window.addEventListener('resize', updatePreviewScale)
    return () => window.removeEventListener('resize', updatePreviewScale)
  }, [])

  useEffect(() => {
    if (hasAskedNameRef.current) return
    hasAskedNameRef.current = true
    setNameInput((prev) => prev || 'Your Name')
    setShowNameModal(true)
  }, [])

  const handleNameConfirm = () => {
    const trimmed = nameInput.trim()
    if (!trimmed) return
    setCard((prev) => ({ ...prev, userName: trimmed }))
    setShowNameModal(false)
  }

  useEffect(() => {
    let cancelled = false
    async function run() {
      if (!card.autoTextColor) return
      try {
        const cacheKey = `${card.backgroundId}:${card.templateId}`
        const cached = aiPaletteCacheRef.current.get(cacheKey)
        const palette = cached ?? (await requestAiPalette(card.backgroundId, card.templateId))
        if (!cached) {
          aiPaletteCacheRef.current.set(cacheKey, palette)
        }
        if (cancelled) return
        setCard((prev) => {
          if (!prev.autoTextColor) return prev
          return { ...prev, textColor: palette.textColor, accentColor: palette.accentColor }
        })
      } catch {
        // Fallback to local luminance-based contrast if AI is unavailable.
        const recommended = await recommendTextColorFromBackgroundId(card.backgroundId)
        if (cancelled) return
        setCard((prev) => {
          if (!prev.autoTextColor) return prev
          return { ...prev, textColor: recommended, accentColor: recommended }
        })
      }
    }
    void run()
    return () => {
      cancelled = true
    }
  }, [card.backgroundId, card.autoTextColor, card.templateId])

  const onSelectTemplate = (nextTemplateId: TemplateId) => {
    setCard((prev) => ({ ...prev, templateId: nextTemplateId }))
  }

  const handleLogoPlacementChange = (placement: LogoState['placement']) => {
    setLogoCustomPosition(false)
    setCard((prev) => {
      if (!prev.logo) return prev
      const pos = getDefaultLogoPosition(placement, prev.logo.widthPx, prev.logo.aspectRatio)
      return {
        ...prev,
        logo: {
          ...prev.logo,
          placement,
          x: pos.x,
          y: pos.y,
        },
      }
    })
  }

  const handleLogoWidthChange = (widthPx: number) => {
    setCard((prev) => {
      if (!prev.logo) return prev

      const pos = getDefaultLogoPosition(prev.logo.placement, widthPx, prev.logo.aspectRatio)
      const nextX = logoCustomPosition ? prev.logo.x : pos.x
      const nextY = logoCustomPosition ? prev.logo.y : pos.y

      return {
        ...prev,
        logo: {
          ...prev.logo,
          widthPx,
          x: nextX,
          y: nextY,
        },
      }
    })
  }

  const handleLogoPositionChange = (nextX: number, nextY: number) => {
    if (!card.logo) return
    setLogoCustomPosition(true)
    setCard((prev) => {
      if (!prev.logo) return prev
      return {
        ...prev,
        logo: {
          ...prev.logo,
          x: nextX,
          y: nextY,
        },
      }
    })
  }

  const onDownloadPng = async () => {
    const node = cardRef.current
    if (!node) return

    // Wait for font loading + background analysis to reduce “wrong font/color” surprises.
    try {
      await (document as any).fonts?.ready
    } catch {
      // ignore
    }

    const dataUrl = await toPng(node, {
      cacheBust: true,
      pixelRatio: 2,
      width: 720,
      height: 1080,
    })

    const link = document.createElement('a')
    link.download = 'eid-card.png'
    link.href = dataUrl
    link.click()
  }

  const templateList = useMemo(() => templates, [])

  return (
    <div className="min-h-dvh bg-zinc-50 pb-24 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 lg:pb-0">
      {showNameModal ? (
        <div className="fixed inset-0 z-120 flex items-center justify-center bg-black/50 px-4 backdrop-blur-[2px]">
          <div className="w-full max-w-md rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-2xl dark:border-zinc-700/80 dark:bg-zinc-900">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Welcome to Eid Card Generator</h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
              Enter your name. It will be used as the signature on the card.
            </p>

            <label className="mt-4 block text-xs font-semibold text-zinc-700 dark:text-zinc-200">
              Your Name
              <input
                autoFocus
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleNameConfirm()
                  }
                }}
                className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50"
                placeholder="Type your name"
              />
            </label>

            <button
              type="button"
              onClick={handleNameConfirm}
              disabled={!nameInput.trim()}
              className="mt-5 w-full rounded-2xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-100"
            >
              Continue
            </button>
          </div>
        </div>
      ) : null}

      <div className="mx-auto grid w-full max-w-[1460px] grid-cols-1 lg:grid-cols-[380px_1fr_380px] lg:items-start">
        {/* Left controls */}
        <aside className="order-2 w-full border-b border-zinc-200 p-4 lg:order-1 lg:border-b-0 lg:border-r lg:border-zinc-200 dark:border-zinc-800">
          <div className="text-lg font-bold">Eid Card Generator</div>
          <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
            Customize, preview, and download as PNG.
          </div>

          <div className="mt-4 rounded-2xl border border-zinc-200/70 bg-white/60 p-3 text-xs text-zinc-700 dark:border-zinc-800/70 dark:bg-zinc-900/20 dark:text-zinc-300">
            <div className="mb-2 font-semibold text-zinc-900 dark:text-zinc-100">How to make your card</div>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Pick a template.</li>
              <li>Edit the title, message, and name.</li>
              <li>Choose font + text color.</li>
              <li>Toggle stars/moons/sparkles.</li>
              <li>Use the permanent logo in the corner.</li>
              <li>
                Drag the logo if you want, then click <span className="font-semibold">Download PNG</span>.
              </li>
            </ol>
          </div>

          <div className="mt-4 space-y-4">
            <TemplateSelector
              templates={templateList}
              selectedTemplateId={card.templateId}
              onSelectTemplate={onSelectTemplate}
            />

            <ControlsPanel
              region="left"
              card={card}
              setCard={setCard}
              selectedMessagePresetId={selectedMessagePresetId}
              setSelectedMessagePresetId={setSelectedMessagePresetId}
              onDownloadPng={onDownloadPng}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              enableLogoDrag={enableLogoDrag}
              setEnableLogoDrag={setEnableLogoDrag}
              onLogoPlacementChange={handleLogoPlacementChange}
              onLogoWidthChange={handleLogoWidthChange}
              currentTemplateId={card.templateId}
              showDownloadButton={false}
            />
          </div>
        </aside>

        {/* Preview */}
        <main className="order-1 overflow-auto p-4 lg:order-2">
          <div className="mx-auto flex w-full max-w-[760px] flex-col items-center gap-4">
            <Preview
              card={card}
              cardRef={cardRef}
              enableLogoDrag={enableLogoDrag}
              onLogoPositionChange={handleLogoPositionChange}
              displayScale={previewScale}
            />
            <button
              type="button"
              onClick={onDownloadPng}
              className="hidden w-full max-w-[560px] rounded-2xl bg-zinc-900 px-4 py-3.5 text-sm font-semibold text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-zinc-800 lg:block dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-100"
            >
              Download PNG
            </button>
          </div>
        </main>

        {/* Right controls */}
        <aside className="order-3 w-full border-t border-zinc-200 p-4 lg:border-t-0 lg:border-l lg:border-zinc-200 dark:border-zinc-800">
          <ControlsPanel
            region="right"
            card={card}
            setCard={setCard}
            selectedMessagePresetId={selectedMessagePresetId}
            setSelectedMessagePresetId={setSelectedMessagePresetId}
            onDownloadPng={onDownloadPng}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            enableLogoDrag={enableLogoDrag}
            setEnableLogoDrag={setEnableLogoDrag}
            onLogoPlacementChange={handleLogoPlacementChange}
            onLogoWidthChange={handleLogoWidthChange}
            currentTemplateId={card.templateId}
              showDownloadButton={false}
          />
        </aside>
      </div>

      <div className="fixed inset-x-4 bottom-3 z-80 lg:hidden">
        <button
          type="button"
          onClick={onDownloadPng}
          className="w-full rounded-2xl bg-zinc-900 px-4 py-3.5 text-sm font-semibold text-white shadow-xl hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-100"
        >
          Download PNG
        </button>
      </div>
    </div>
  )
}
