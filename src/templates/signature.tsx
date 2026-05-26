import { isLightTextColor } from '../lib/readableText'
import type { EidCardState } from './types'

type CardSignatureProps = {
  card: EidCardState
  /** Use full-width rule (e.g. Islamic) or short bar */
  divider?: 'full' | 'short'
  /** Center name, divider, and designation */
  centered?: boolean
}

/**
 * Shared signature block: name + optional designation (hidden when empty).
 */
export function CardSignature({ card, divider = 'short', centered = false }: CardSignatureProps) {
  const accent = card.accentColor
  const light = isLightTextColor(card.textColor)
  const dividerWidth = divider === 'full' ? '100%' : 'min(240px, 100%)'
  const nameShadow = light
    ? '0 0 2px rgba(0,0,0,0.88), 0 1px 3px rgba(0,0,0,0.9), 0 4px 18px rgba(0,0,0,0.55)'
    : '0 0 2px rgba(255,255,255,0.95), 0 1px 2px rgba(255,255,255,0.6), 0 4px 16px rgba(255,255,255,0.35)'

  return (
    <>
      <div
        className={[divider === 'full' ? 'mt-[16px]' : 'mt-[10px]', centered ? 'mx-auto' : ''].join(' ')}
        style={{
          height: 2,
          width: dividerWidth,
          maxWidth: divider === 'full' ? undefined : '100%',
          borderRadius: 9999,
          background:
            divider === 'full'
              ? `linear-gradient(90deg, transparent 0%, ${accent}66 12%, ${accent}99 50%, ${accent}66 88%, transparent 100%)`
              : `linear-gradient(90deg, transparent 0%, ${accent}55 18%, ${accent}cc 50%, ${accent}55 82%, transparent 100%)`,
          opacity: divider === 'full' ? 0.85 : 1,
        }}
      />
      <div
        className={[
          'mt-[16px] text-[30px] leading-[1.2] tracking-[-0.02em]',
          card.boldText ? 'font-extrabold' : 'font-semibold',
          centered ? 'text-center' : '',
        ].join(' ')}
        style={{
          fontWeight: card.boldText ? 800 : 600,
          textShadow: nameShadow,
        }}
      >
        {card.userName}
      </div>
      {card.designation ? (
        <div
          className={[
            'mt-[12px] flex flex-wrap gap-2',
            centered ? 'justify-center' : 'items-center',
          ].join(' ')}
        >
          <span
            className="inline-block rounded-full px-4 py-2 text-[13px] font-medium leading-snug tracking-[0.03em]"
            style={{
              color: light ? card.textColor : accent,
              backgroundColor: light ? 'rgba(255,255,255,0.1)' : `${accent}28`,
              border: `1px solid ${accent}66`,
              boxShadow: light
                ? '0 2px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08)'
                : '0 2px 14px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2)',
              textShadow: light ? nameShadow : 'none',
            }}
          >
            {card.designation}
          </span>
        </div>
      ) : null}
    </>
  )
}

type CardSignatureCompactProps = {
  card: EidCardState
  className?: string
}

/**
 * Small corner signature for animal themes — sits bottom-left, not centered.
 */
export function CardSignatureCompact({ card, className = '' }: CardSignatureCompactProps) {
  const accent = card.accentColor
  const light = isLightTextColor(card.textColor)
  const textShadow = light
    ? '0 1px 3px rgba(0,0,0,0.85), 0 2px 10px rgba(0,0,0,0.5)'
    : '0 1px 2px rgba(255,255,255,0.8), 0 2px 8px rgba(0,0,0,0.25)'

  return (
    <div className={['max-w-[260px] text-left', className].filter(Boolean).join(' ')}>
      <div
        aria-hidden="true"
        style={{
          height: 1.5,
          width: 40,
          borderRadius: 9999,
          background: `linear-gradient(90deg, ${accent}cc 0%, ${accent}44 70%, transparent 100%)`,
        }}
      />
      <div
        className={[
          'mt-[8px] text-[19px] leading-[1.25] tracking-[-0.01em]',
          card.boldText ? 'font-bold' : 'font-medium',
        ].join(' ')}
        style={{ textShadow }}
      >
        {card.userName}
      </div>
      {card.designation ? (
        <div
          className="mt-[4px] text-[11px] font-normal leading-snug tracking-[0.02em] opacity-90"
          style={{
            color: light ? card.textColor : accent,
            textShadow,
          }}
        >
          {card.designation}
        </div>
      ) : null}
    </div>
  )
}
