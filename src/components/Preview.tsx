import { useMemo, useRef, useState } from 'react'
import type React from 'react'
import { publicAssetUrl } from '../lib/publicAssetUrl'
import { getTemplateById } from '../templates/registry'
import { CARD_HEIGHT, CARD_WIDTH, type EidCardState } from '../templates/types'

type PreviewProps = {
  card: EidCardState
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
        borderRadius: 32 * displayScale,
      }}
    >
      {/*
        Native design canvas: exactly CARD_WIDTH × CARD_HEIGHT.
        Export uses this node so html-to-image matches on-screen layout (no nested scale bug).
      */}
      <div
        ref={cardRef}
        className={[
          'relative touch-manipulation overflow-hidden rounded-[32px]',
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
          src={publicAssetUrl(`${card.backgroundId}.png`)}
          alt=""
          loading="eager"
          decoding="async"
          draggable={false}
          className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover select-none"
        />
        <div
          className="absolute inset-0 z-1"
          style={{
            background:
              'linear-gradient(180deg, rgba(4,8,16,0.58) 0%, rgba(5,10,20,0.34) 34%, rgba(5,10,20,0.26) 64%, rgba(4,8,16,0.56) 100%), radial-gradient(72% 48% at 50% 42%, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.28) 100%)',
            backdropFilter: 'none',
            WebkitBackdropFilter: 'none',
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 z-1 opacity-40 lg:opacity-[0.55]"
          style={{
            background: `radial-gradient(70% 38% at 50% 38%, ${card.accentColor}24 0%, transparent 78%)`,
            mixBlendMode: 'soft-light',
          }}
        />

        <div
          className="relative z-2 h-full w-full"
          style={{
            textShadow: '0 2px 14px rgba(0, 0, 0, 0.45)',
          }}
        >
          {template.render(cardWithoutLogo)}
          {card.logo ? (
            <img
              src={card.logo.dataUrl}
              alt="Logo"
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
