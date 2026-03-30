import { useEffect, useMemo, useRef, useState } from 'react'
import { toBlob } from 'html-to-image'
import { publicAssetUrl } from '../lib/publicAssetUrl'
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

function isNarrowScreen() {
  return typeof window !== 'undefined' && window.matchMedia('(max-width: 1023px)').matches
}

function blobToDataUrl(blob: Blob): Promise<string> {
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

/** iOS / iPadOS: `<a download>` with blob/data URLs usually does not save to Photos. */
function isAppleTouchDevice() {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent || ''
  const iOS = /iPad|iPhone|iPod/.test(ua)
  const iPadOS = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1
  return iOS || iPadOS
}

/** Instagram, Facebook, Line, etc. often block real downloads — suggest system browser. */
function isLikelyInAppBrowser() {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent || ''
  return /Instagram|FBAN|FBAV|FB_IAB|Line\/|\bSnapchat\b|Twitter/i.test(ua)
}

type DeliverPngResult =
  | { outcome: 'complete' }
  | { outcome: 'showManualSave'; objectUrl: string; showInAppBrowserHint: boolean }

async function waitForCardBackgroundImage(root: HTMLElement) {
  const img = root.querySelector<HTMLImageElement>('[data-card-background]')
  if (!img) return
  if (img.complete && img.naturalWidth === 0) {
    throw new Error('Background image failed to load')
  }
  if (!img.complete || img.naturalWidth === 0) {
    await new Promise<void>((resolve, reject) => {
      const done = () => {
        img.removeEventListener('load', done)
        img.removeEventListener('error', onErr)
        if (img.naturalWidth === 0) {
          reject(new Error('Background image failed to load'))
          return
        }
        resolve()
      }
      const onErr = () => {
        img.removeEventListener('load', done)
        img.removeEventListener('error', onErr)
        reject(new Error('Background image failed to load'))
      }
      img.addEventListener('load', done)
      img.addEventListener('error', onErr)
    })
  }
  try {
    await img.decode()
  } catch {
    // decode() unsupported or decode failed — still try capture
  }
}

function scheduleRevokeObjectUrl(url: string, ms = 120_000) {
  window.setTimeout(() => URL.revokeObjectURL(url), ms)
}

function canSharePngFile(file: File): boolean {
  if (typeof navigator.canShare !== 'function') return true
  try {
    return navigator.canShare({ files: [file] })
  } catch {
    return false
  }
}

/**
 * iPhone/iPad: Web Share with files when supported; never rely on `<a download>` for blobs.
 * Desktop/Android: `<a download>` first; then share-with-files; then new tab; then in-app modal.
 */
async function deliverPngBlobToUser(blob: Blob): Promise<DeliverPngResult> {
  const objectUrl = URL.createObjectURL(blob)
  const inApp = isLikelyInAppBrowser()
  const apple = isAppleTouchDevice()
  const canUseShare =
    typeof window !== 'undefined' && window.isSecureContext && typeof navigator.share === 'function'

  if (apple) {
    if (canUseShare) {
      const file = new File([blob], 'eid-card.png', { type: 'image/png' })
      if (canSharePngFile(file)) {
        try {
          await navigator.share({
            files: [file],
            title: 'Eid Card',
            text: 'Save your Eid card',
          })
          scheduleRevokeObjectUrl(objectUrl)
          return { outcome: 'complete' }
        } catch (err) {
          if ((err as Error).name === 'AbortError') {
            scheduleRevokeObjectUrl(objectUrl)
            return { outcome: 'complete' }
          }
        }
      }

      try {
        await navigator.share({
          url: objectUrl,
          title: 'Eid Card',
          text: 'Save your Eid card',
        })
        scheduleRevokeObjectUrl(objectUrl)
        return { outcome: 'complete' }
      } catch (err) {
        if ((err as Error).name === 'AbortError') {
          scheduleRevokeObjectUrl(objectUrl)
          return { outcome: 'complete' }
        }
      }
    }

    return { outcome: 'showManualSave', objectUrl, showInAppBrowserHint: inApp }
  }

  try {
    const a = document.createElement('a')
    a.href = objectUrl
    a.download = 'eid-card.png'
    a.rel = 'noopener'
    document.body.appendChild(a)
    a.click()
    a.remove()
    scheduleRevokeObjectUrl(objectUrl)
    return { outcome: 'complete' }
  } catch {
    if (canUseShare) {
      const file = new File([blob], 'eid-card.png', { type: 'image/png' })
      if (canSharePngFile(file)) {
        try {
          await navigator.share({
            files: [file],
            title: 'Eid Card',
            text: 'Save your Eid card',
          })
          scheduleRevokeObjectUrl(objectUrl)
          return { outcome: 'complete' }
        } catch (err) {
          if ((err as Error).name === 'AbortError') {
            scheduleRevokeObjectUrl(objectUrl)
            return { outcome: 'complete' }
          }
        }
      }
    }

    const popup = window.open(objectUrl, '_blank', 'noopener,noreferrer')
    if (popup == null) {
      return { outcome: 'showManualSave', objectUrl, showInAppBrowserHint: inApp }
    }
    scheduleRevokeObjectUrl(objectUrl)
    return { outcome: 'complete' }
  }
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
  const url = publicAssetUrl(`${backgroundId}.png`)
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
  const backgroundDataUrlCacheRef = useRef<Map<BackgroundId, string>>(new Map())
  const downloadInFlightRef = useRef(false)

  const initialFont = fontOptions[0]
  const initialPreset = presetEidMessages[0]

  const [darkMode, setDarkMode] = useState(false)
  const [enableLogoDrag, setEnableLogoDrag] = useState(true)
  const [selectedMessagePresetId, setSelectedMessagePresetId] = useState(initialPreset.id)
  const [logoCustomPosition, setLogoCustomPosition] = useState(false)
  const [showNameModal, setShowNameModal] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const [designationInput, setDesignationInput] = useState('')
  const [previewScale, setPreviewScale] = useState(0.8)
  const [exportLoading, setExportLoading] = useState(false)
  const [saveImageModal, setSaveImageModal] = useState<{
    objectUrl: string
    showInAppHint: boolean
  } | null>(null)
  const [backgroundReady, setBackgroundReady] = useState(false)
  const [resolvedBackgroundSrc, setResolvedBackgroundSrc] = useState(() => publicAssetUrl('bg1.png'))
  const resizeRafRef = useRef<number | null>(null)

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
      designation: '',
      textColor: DEFAULT_TEXT_COLOR,
      accentColor: DEFAULT_ACCENT_COLOR,
      autoTextColor: false,
      fontId: font.id,
      fontFamily: font.familyCss,
      boldText: false,
      decorations: { stars: true, moons: false, sparkles: true },
      logo: {
        // Use the permanent default logo from `public/School_logo.png`.
        dataUrl: publicAssetUrl('School_logo.png'),
        x: defaultPos.x,
        y: defaultPos.y,
        widthPx: DEFAULT_LOGO_WIDTH_PX,
        aspectRatio: 1,
        placement: defaultPlacement,
      },
    }

    return base
  })

  // Warm cache so mobile export isn’t racing a slow first paint of large PNGs.
  useEffect(() => {
    ;(['bg1', 'bg2', 'bg3', 'bg4'] as BackgroundId[]).forEach((id) => {
      const im = new Image()
      im.src = publicAssetUrl(`${id}.png`)
    })
  }, [])

  // Convert selected background into data URL so iPhone export does not depend on URL/CORS at capture time.
  useEffect(() => {
    let cancelled = false
    setBackgroundReady(false)
    const id = card.backgroundId
    const directUrl = publicAssetUrl(`${id}.png`)
    const cached = backgroundDataUrlCacheRef.current.get(id)
    if (cached) {
      setResolvedBackgroundSrc(cached)
      return () => {
        cancelled = true
      }
    }

    setResolvedBackgroundSrc(directUrl)
    void (async () => {
      try {
        const res = await fetch(directUrl, { cache: 'force-cache' })
        if (!res.ok) throw new Error(`Background fetch failed: ${res.status}`)
        const blob = await res.blob()
        const dataUrl = await blobToDataUrl(blob)
        backgroundDataUrlCacheRef.current.set(id, dataUrl)
        if (!cancelled) setResolvedBackgroundSrc(dataUrl)
      } catch {
        if (!cancelled) setResolvedBackgroundSrc(directUrl)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [card.backgroundId])

  // Hard gate: do not allow export until the chosen background source is actually decoded.
  useEffect(() => {
    let cancelled = false
    setBackgroundReady(false)
    const img = new Image()
    img.src = resolvedBackgroundSrc
    const done = () => {
      if (cancelled) return
      setBackgroundReady(img.naturalWidth > 0)
    }
    const fail = () => {
      if (cancelled) return
      setBackgroundReady(false)
    }
    img.onload = done
    img.onerror = fail
    if (img.complete) done()
    return () => {
      cancelled = true
    }
  }, [resolvedBackgroundSrc])

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
    function computeScale() {
      const vw = window.innerWidth
      if (vw < 640) {
        const fit = (vw - 26) / CARD_WIDTH
        return clamp(fit, 0.42, 0.6)
      }
      if (vw < 1024) return 0.72
      return 0.8
    }

    function scheduleUpdate() {
      if (resizeRafRef.current !== null) return
      resizeRafRef.current = window.requestAnimationFrame(() => {
        resizeRafRef.current = null
        setPreviewScale(computeScale())
      })
    }

    setPreviewScale(computeScale())
    window.addEventListener('resize', scheduleUpdate, { passive: true })
    return () => {
      window.removeEventListener('resize', scheduleUpdate)
      if (resizeRafRef.current !== null) {
        cancelAnimationFrame(resizeRafRef.current)
      }
    }
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
    const normalizedDesignation = designationInput.trim()
    setCard((prev) => ({
      ...prev,
      userName: trimmed,
      designation: normalizedDesignation,
    }))
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

  const captureCardPngBlob = async (): Promise<Blob> => {
    const node = cardRef.current
    if (!node) throw new Error('Preview not ready')
    if (!backgroundReady) throw new Error('Background still loading')

    try {
      await (document as any).fonts?.ready
    } catch {
      // ignore
    }

    await waitForCardBackgroundImage(node)

    const narrow = isNarrowScreen()
    const blob = await toBlob(node, {
      cacheBust: true,
      // Slightly lighter on phones to reduce memory pressure during capture.
      pixelRatio: narrow ? 1.25 : 2,
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      // Preview uses CSS scale on the 720×1080 root; strip it on the clone so PNG matches design.
      style: {
        transform: 'none',
        transformOrigin: 'top left',
        // iPhone fallback: paint background on root clone as well, in case absolutely
        // positioned <img> is skipped by foreignObject rendering.
        backgroundImage: `url("${resolvedBackgroundSrc}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      },
    })
    if (!blob) throw new Error('Export produced an empty image')
    return blob
  }

  const onDownloadPng = async () => {
    // Prevent double-tap on mobile from triggering multiple `navigator.share()` calls.
    if (downloadInFlightRef.current) return
    if (!backgroundReady) {
      window.alert('Background is still loading. Please wait 1-2 seconds and try again.')
      return
    }
    downloadInFlightRef.current = true
    setExportLoading(true)
    try {
      const blob = await captureCardPngBlob()
      const result = await deliverPngBlobToUser(blob)
      if (result.outcome === 'showManualSave') {
        setSaveImageModal({
          objectUrl: result.objectUrl,
          showInAppHint: result.showInAppBrowserHint,
        })
      }
    } catch (e) {
      console.error(e)
      window.alert('Could not download the image. Please try again.')
    } finally {
      setExportLoading(false)
      downloadInFlightRef.current = false
    }
  }

  const templateList = useMemo(() => templates, [])

  const closeSaveImageModal = () => {
    setSaveImageModal((prev) => {
      if (prev) URL.revokeObjectURL(prev.objectUrl)
      return null
    })
  }

  return (
    <div className="min-h-dvh bg-zinc-50 pb-24 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 lg:pb-0">
      {showNameModal ? (
        <div className="fixed inset-0 z-120 flex items-center justify-center bg-black/50 px-4 backdrop-blur-none sm:backdrop-blur-[2px]">
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

            <label className="mt-3 block text-xs font-semibold text-zinc-700 dark:text-zinc-200">
              Position / Designation (optional)
              <select
                value={designationInput}
                onChange={(e) => setDesignationInput(e.target.value)}
                className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50"
              >
                <option value="">No designation</option>
                <option value="Student">Student</option>
                <option value="Teacher">Teacher</option>
                <option value="Staff">Staff</option>
                <option value="Admin">Admin</option>
              </select>
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

      {saveImageModal ? (
        <div className="fixed inset-0 z-130 flex items-center justify-center bg-black/55 px-4 py-8 backdrop-blur-none sm:backdrop-blur-[2px]">
          <div
            className="max-h-[min(92dvh,920px)] w-full max-w-md overflow-y-auto rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-2xl dark:border-zinc-700/80 dark:bg-zinc-900"
            role="dialog"
            aria-modal="true"
            aria-labelledby="save-card-title"
          >
            <h2
              id="save-card-title"
              className="text-lg font-bold text-zinc-900 dark:text-zinc-50"
            >
              Save your card
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
              Long-press the image below, then tap{' '}
              <span className="font-semibold text-zinc-800 dark:text-zinc-100">Save to Photos</span>{' '}
              (or your browser&apos;s save option).
            </p>
            {saveImageModal.showInAppHint ? (
              <p className="mt-3 rounded-xl border border-amber-200/90 bg-amber-50 px-3 py-2 text-xs text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
                For best results, open this page in{' '}
                <span className="font-semibold">Safari</span> or{' '}
                <span className="font-semibold">Chrome</span>, then download again.
              </p>
            ) : null}
            <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-950">
              <img
                src={saveImageModal.objectUrl}
                alt="Your Eid card — long-press to save"
                className="mx-auto block max-h-[min(58dvh,520px)] w-full object-contain"
                draggable={false}
              />
            </div>
            <button
              type="button"
              onClick={closeSaveImageModal}
              className="mt-5 w-full rounded-2xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-100"
            >
              Close
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
              backgroundSrc={resolvedBackgroundSrc}
              cardRef={cardRef}
              enableLogoDrag={enableLogoDrag}
              onLogoPositionChange={handleLogoPositionChange}
              displayScale={previewScale}
            />
            <button
              type="button"
              onClick={onDownloadPng}
              disabled={exportLoading || !backgroundReady}
              className="hidden w-full max-w-[560px] rounded-2xl bg-zinc-900 px-4 py-3.5 text-sm font-semibold text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 lg:block dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-100"
            >
              {exportLoading ? 'Downloading…' : backgroundReady ? 'Download PNG' : 'Preparing background…'}
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

      <div className="px-4 pb-4 text-center text-[11px] text-zinc-600 dark:text-zinc-400">
        <span className="opacity-85">TM • Built by </span>
        <a
          href="https://github.com/salahakramfuad"
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-zinc-800 underline decoration-zinc-400 underline-offset-2 hover:text-zinc-950 dark:text-zinc-200 dark:hover:text-white"
        >
          Mohammad Salah
        </a>
      </div>

      <div className="fixed inset-x-4 bottom-3 z-100 lg:hidden">
        <button
          type="button"
          onClick={onDownloadPng}
          disabled={exportLoading || !backgroundReady}
          className="w-full rounded-2xl bg-zinc-900 px-4 py-3.5 text-sm font-semibold text-white shadow-xl hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.99] dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-100"
        >
          {exportLoading ? 'Downloading…' : backgroundReady ? 'Download PNG' : 'Preparing background…'}
        </button>
      </div>
    </div>
  )
}
