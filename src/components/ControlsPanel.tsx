import type React from 'react'
import { fontOptions } from '../lib/fonts'
import { presetEidMessages } from '../lib/eidMessages'
import type { BackgroundId, EidCardState, LogoState, TemplateId } from '../templates/types'

type ControlsPanelProps = {
  card: EidCardState
  setCard: React.Dispatch<React.SetStateAction<EidCardState>>

  selectedMessagePresetId: string
  setSelectedMessagePresetId: (id: string) => void

  onDownloadPng: () => void

  darkMode: boolean
  setDarkMode: (v: boolean) => void

  enableLogoDrag: boolean
  setEnableLogoDrag: (v: boolean) => void

  onLogoPlacementChange: (placement: LogoState['placement']) => void
  onLogoWidthChange: (widthPx: number) => void

  currentTemplateId: TemplateId
  /**
   * Render only part of the editor controls so we can place them
   * on the left and right sides around the preview.
   */
  region: 'left' | 'right'
}

function renderFontSelectOptions() {
  return fontOptions.map((f) => (
    <option key={f.id} value={f.id}>
      {f.label}
    </option>
  ))
}

export default function ControlsPanel({
  card,
  setCard,
  selectedMessagePresetId,
  setSelectedMessagePresetId,
  onDownloadPng,
  darkMode,
  setDarkMode,
  enableLogoDrag,
  setEnableLogoDrag,
  onLogoPlacementChange,
  onLogoWidthChange,
  region,
}: ControlsPanelProps) {
  const selectedFont = fontOptions.find((f) => f.id === card.fontId) ?? fontOptions[0]

  return (
    <div className="flex flex-col gap-4">
      {/* LEFT: Message content */}
      {region === 'left' ? (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Message</h2>
          </div>

          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Greeting title
            <input
              type="text"
              value={card.title}
              onChange={(e) => {
                setCard((prev) => ({ ...prev, title: e.target.value }))
              }}
              className="mt-1 w-full rounded-xl border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900/30 dark:text-zinc-50"
            />
          </label>

          <label className="mt-3 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Preset message
            <select
              value={selectedMessagePresetId}
              onChange={(e) => {
                const id = e.target.value
                setSelectedMessagePresetId(id)
                if (id === 'custom') return
                const preset = presetEidMessages.find((p) => p.id === id)
                if (!preset) return
                setCard((prev) => ({ ...prev, message: preset.message }))
              }}
              className="mt-1 w-full rounded-xl border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900/30 dark:text-zinc-50"
            >
              <option value="custom">Custom</option>
              {presetEidMessages.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>

          <label className="mt-3 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Message body
            <textarea
              value={card.message}
              onChange={(e) => {
                setCard((prev) => ({ ...prev, message: e.target.value }))
                if (selectedMessagePresetId !== 'custom') setSelectedMessagePresetId('custom')
              }}
              rows={4}
              className="mt-1 w-full resize-y rounded-xl border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900/30 dark:text-zinc-50"
            />
          </label>

          <label className="mt-3 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Name / Signature
            <input
              type="text"
              value={card.userName}
              onChange={(e) => {
                setCard((prev) => ({ ...prev, userName: e.target.value }))
              }}
              className="mt-1 w-full rounded-xl border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900/30 dark:text-zinc-50"
            />
          </label>
        </div>
      ) : null}

      {/* RIGHT: Style + logo + download */}
      {region === 'right' ? (
        <>
          <div className="rounded-2xl border border-zinc-200/70 bg-white/60 p-4 dark:border-zinc-800/70 dark:bg-zinc-900/20">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Background</h3>
              <div className="text-xs text-zinc-600 dark:text-zinc-400">bg1 - bg4</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {(['bg1', 'bg2', 'bg3', 'bg4'] as BackgroundId[]).map((bgId) => (
                <button
                  key={bgId}
                  type="button"
                  onClick={() => {
                    setCard((prev) => ({ ...prev, backgroundId: bgId }))
                  }}
                  className={[
                    'relative overflow-hidden rounded-xl border px-2 py-2 text-left transition',
                    card.backgroundId === bgId
                      ? 'border-zinc-900/70 dark:border-zinc-100/80 bg-zinc-100/40 dark:bg-zinc-800/40'
                      : 'border-zinc-300/60 hover:bg-zinc-100/30 dark:border-zinc-700/60 dark:hover:bg-zinc-800/30',
                  ].join(' ')}
                >
                  <div
                    className="h-16 w-full rounded-lg"
                    style={{
                      backgroundImage: `url('/${bgId}.png')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                    }}
                  />
                  <div className="mt-2 text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                    {bgId.toUpperCase()}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200/70 bg-white/60 p-4 dark:border-zinc-800/70 dark:bg-zinc-900/20">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Style</h3>
            </div>

            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">AI palette</div>
              <label className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300">
                <span>Auto (AI) text + accents</span>
                <input
                  type="checkbox"
                  checked={card.autoTextColor}
                  onChange={(e) => {
                    const next = e.target.checked
                    setCard((prev) => ({ ...prev, autoTextColor: next }))
                  }}
                />
              </label>
            </div>

            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Text color
              <div className="mt-1 flex items-center gap-3">
                <input
                  type="color"
                  value={card.textColor}
                  disabled={card.autoTextColor}
                  onChange={(e) => {
                    const next = e.target.value
                    setCard((prev) => ({ ...prev, autoTextColor: false, textColor: next, accentColor: next }))
                  }}
                  className="h-10 w-12 cursor-pointer rounded-xl border border-zinc-200 bg-white p-1 dark:border-zinc-700 dark:bg-zinc-950"
                />
                <input
                  type="text"
                  value={card.textColor}
                  disabled={card.autoTextColor}
                  onChange={(e) => {
                    const next = e.target.value
                    setCard((prev) => ({ ...prev, autoTextColor: false, textColor: next, accentColor: next }))
                  }}
                  className="w-full rounded-xl border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900/30 dark:text-zinc-50"
                />
              </div>
            </label>

            <label className="mt-3 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Font style (Google Fonts)
              <select
                value={card.fontId}
                onChange={(e) => {
                  const next = fontOptions.find((f) => f.id === e.target.value) ?? selectedFont
                  setCard((prev) => ({ ...prev, fontId: next.id, fontFamily: next.familyCss }))
                }}
                className="mt-1 w-full rounded-xl border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900/30 dark:text-zinc-50"
              >
                {renderFontSelectOptions()}
              </select>
            </label>

            <div className="mt-4">
              <div className="mb-2 text-xs font-medium text-zinc-700 dark:text-zinc-300">Decorations</div>
              <div className="flex flex-wrap gap-3">
                <label className="flex items-center gap-2 text-sm text-zinc-800 dark:text-zinc-200">
                  <input
                    type="checkbox"
                    checked={card.decorations.stars}
                    onChange={(e) => {
                      setCard((prev) => ({
                        ...prev,
                        decorations: { ...prev.decorations, stars: e.target.checked },
                      }))
                    }}
                  />
                  Stars
                </label>
                <label className="flex items-center gap-2 text-sm text-zinc-800 dark:text-zinc-200">
                  <input
                    type="checkbox"
                    checked={card.decorations.moons}
                    onChange={(e) => {
                      setCard((prev) => ({
                        ...prev,
                        decorations: { ...prev.decorations, moons: e.target.checked },
                      }))
                    }}
                  />
                  Moons
                </label>
                <label className="flex items-center gap-2 text-sm text-zinc-800 dark:text-zinc-200">
                  <input
                    type="checkbox"
                    checked={card.decorations.sparkles}
                    onChange={(e) => {
                      setCard((prev) => ({
                        ...prev,
                        decorations: { ...prev.decorations, sparkles: e.target.checked },
                      }))
                    }}
                  />
                  Sparkles
                </label>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200/70 bg-white/60 p-4 dark:border-zinc-800/70 dark:bg-zinc-900/20">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Logo</h3>
            </div>

            <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
              Permanent logo (no upload).
            </div>

            {card.logo ? (
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={card.logo.dataUrl}
                    alt="Logo preview"
                    style={{
                      width: 54,
                      height: Math.round(54 * card.logo.aspectRatio),
                      objectFit: 'contain',
                  borderRadius: 0,
                  border: 'none',
                  boxShadow: 'none',
                  background: 'transparent',
                    }}
                  />

                  <div className="ml-auto text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                    Always shown on card
                  </div>
                </div>

                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Position
                  <select
                    value={card.logo.placement}
                onChange={(e) => onLogoPlacementChange(e.target.value as LogoState['placement'])}
                    className="mt-1 w-full rounded-xl border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900/30 dark:text-zinc-50"
                  >
                  <option value="top-left">Top-left</option>
                  <option value="top-right">Top-right</option>
                  <option value="bottom-left">Bottom-left</option>
                  <option value="bottom-right">Bottom-right</option>
                  </select>
                </label>

                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Resize
                  <input
                    type="range"
                    min={120}
                    max={320}
                    step={5}
                    value={card.logo.widthPx}
                    onChange={(e) => onLogoWidthChange(Number(e.target.value))}
                    className="mt-2 w-full"
                  />
                  <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                    {card.logo.widthPx}px
                  </div>
                </label>

                <label className="flex items-center justify-between gap-3 text-sm text-zinc-800 dark:text-zinc-200">
                  <span>Drag logo on preview</span>
                  <input
                    type="checkbox"
                    checked={enableLogoDrag}
                    onChange={(e) => setEnableLogoDrag(e.target.checked)}
                  />
                </label>
              </div>
            ) : (
              <div className="mt-3 text-xs text-zinc-600 dark:text-zinc-400">
                Loading default logo...
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-zinc-200/70 bg-white/60 p-4 dark:border-zinc-800/70 dark:bg-zinc-900/20">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Appearance</div>
              <label className="flex items-center gap-2 text-sm text-zinc-800 dark:text-zinc-200">
                <span>Dark mode</span>
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={(e) => setDarkMode(e.target.checked)}
                />
              </label>
            </div>

            <button
              type="button"
              onClick={onDownloadPng}
              className="mt-4 w-full rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-100"
            >
              Download PNG
            </button>
          </div>
        </>
      ) : null}
    </div>
  )
}

