import { useMemo, useRef, useState } from 'react'
import type React from 'react'
import { getTemplateById } from '../templates/registry'
import { CARD_HEIGHT, CARD_WIDTH, type EidCardState } from '../templates/types'

type PreviewProps = {
  card: EidCardState
  backgroundSrc: string
  cardRef: React.RefObject<HTMLDivElement | null>
  enableLogoDrag?: boolean
  onLogoPositionChange: (nextX: number, nextY: number) => void
  /**
   * Scales down the on-screen preview only.
   * PNG export captures `cardRef` at native 720×1080 (no parent scale mismatch).
   */
  displayScale?: number
}

export default function Preview({
  card,
  backgroundSrc,
  cardRef,
  enableLogoDrag = true,
  onLogoPositionChange,
  displayScale = 0.62,
}: PreviewProps) {
  const scaledWidth = CARD_WIDTH * displayScale
  const scaledHeight = CARD_HEIGHT * displayScale

  const [dragging, setDragging] = useState(false)
  const draggingPointerIdRef = useRef<number | null>(null)
  const dragOffsetRef = useRef({ x: 0, y: 0 })

  const template = getTemplateById(card.templateId)
  const cardWithoutLogo: EidCardState = useMemo(() => {
    if (!card.logo) return card
    return { ...card, logo: null }
  }, [card])

  function getRelativePointerPos(e: React.PointerEvent) {
    const el = cardRef.current
    if (!el) return { x: 0, y: 0 }
    const rect = el.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }

  /** Pointer coords are in the scaled visual box → design space 720×1080 */
  function toDesignSpace(pos: { x: number; y: number }) {
    return {
      x: pos.x / displayScale,
      y: pos.y / displayScale,
    }
  }

  const onPointerDown = (e: React.PointerEvent) => {
    if (!enableLogoDrag) return
    if (!card.logo) return
    if (!cardRef.current) return

    const pos = toDesignSpace(getRelativePointerPos(e))
    const logoW = card.logo.widthPx
    const logoH = Math.round(card.logo.widthPx * card.logo.aspectRatio)
    const within =
      pos.x >= card.logo.x &&
      pos.x <= card.logo.x + logoW &&
      pos.y >= card.logo.y &&
      pos.y <= card.logo.y + logoH

    if (!within) return

    draggingPointerIdRef.current = e.pointerId
    dragOffsetRef.current.x = pos.x - card.logo.x
    dragOffsetRef.current.y = pos.y - card.logo.y
    setDragging(true)

    e.currentTarget.setPointerCapture(e.pointerId)
    e.preventDefault()
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!enableLogoDrag) return
    if (!card.logo) return
    if (!dragging) return

    const pointerId = draggingPointerIdRef.current
    if (pointerId === null || pointerId !== e.pointerId) return

    const pos = toDesignSpace(getRelativePointerPos(e))

    const nextX = pos.x - dragOffsetRef.current.x
    const nextY = pos.y - dragOffsetRef.current.y

    const logoW = card.logo.widthPx
    const logoH = Math.round(card.logo.widthPx * card.logo.aspectRatio)

    const clampedX = Math.max(0, Math.min(CARD_WIDTH - logoW, nextX))
    const clampedY = Math.max(0, Math.min(CARD_HEIGHT - logoH, nextY))

    onLogoPositionChange(clampedX, clampedY)
    e.preventDefault()
  }

  const endDrag = (e: React.PointerEvent) => {
    const pointerId = draggingPointerIdRef.current
    if (pointerId === null || pointerId !== e.pointerId) return
    draggingPointerIdRef.current = null
    setDragging(false)
    e.preventDefault()
  }

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: scaledWidth,
        height: scaledHeight,
        // Keep corner radius proportional to the scaled preview
        // so the preview edges match the exported 720×1080 canvas.
        borderRadius: 36 * displayScale,
      }}
    >
      {/*
        Native design canvas: exactly CARD_WIDTH × CARD_HEIGHT.
        Export uses this node so html-to-image matches on-screen layout (no nested scale bug).
      */}
      <div
        ref={cardRef}
        className={[
          'relative touch-manipulation overflow-hidden rounded-[36px]',
          dragging && enableLogoDrag && card.logo ? 'cursor-grabbing' : 'cursor-default',
        ].join(' ')}
        style={{
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          transform: `scale(${displayScale})`,
          transformOrigin: 'top left',
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {/*
          Real <img> (not CSS background) so html-to-image / mobile WebKit reliably embeds
          the photo in the exported PNG.
        */}
        <img
          data-card-background
          src={backgroundSrc}
          alt=""
          loading="eager"
          decoding="async"
          draggable={false}
          // Helps canvas / html-to-image embed same-origin photos (required for some WebKit paths).
          crossOrigin={backgroundSrc.startsWith('data:') ? undefined : 'anonymous'}
          className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover select-none"
        />
        <div
          className="absolute inset-0 z-1"
          style={{
            /* Even tint so type stays readable on bright and dark photo areas. */
            background:
              'linear-gradient(165deg, rgba(6,10,18,0.5) 0%, rgba(5,9,16,0.38) 32%, rgba(4,8,14,0.4) 52%, rgba(5,10,18,0.52) 100%)',
            backdropFilter: 'none',
            WebkitBackdropFilter: 'none',
          }}
        />
        {/* Extra darkening behind the main text column (center). */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-1"
          style={{
            background:
              'radial-gradient(ellipse 96% 72% at 50% 42%, rgba(0,0,0,0.32) 0%, rgba(0,0,0,0.08) 52%, transparent 72%)',
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 z-1 opacity-[0.32] lg:opacity-[0.4]"
          style={{
            background: `radial-gradient(78% 44% at 50% 36%, ${card.accentColor}26 0%, transparent 72%)`,
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-1 opacity-[0.45]"
          style={{
            background:
              'linear-gradient(to bottom, rgba(255,255,255,0.05) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.12) 100%)',
          }}
        />

        <div className="relative z-10 h-full w-full">
          {template.render(cardWithoutLogo)}
          {card.logo ? (
            <img
              src={card.logo.dataUrl}
              alt="Logo"
              crossOrigin={card.logo.dataUrl.startsWith('data:') ? undefined : 'anonymous'}
              className="absolute z-50"
              style={{
                left: card.logo.x,
                top: card.logo.y,
                width: card.logo.widthPx,
                height: Math.round(card.logo.widthPx * card.logo.aspectRatio),
                objectFit: 'contain',
                display: 'block',
                borderRadius: 0,
                boxShadow: 'none',
                background: 'transparent',
                border: 'none',
                pointerEvents: 'auto',
                touchAction: enableLogoDrag ? 'none' : 'auto',
                userSelect: enableLogoDrag ? 'none' : 'auto',
              }}
            />
          ) : null}

        </div>
      </div>
    </div>
  )
}
