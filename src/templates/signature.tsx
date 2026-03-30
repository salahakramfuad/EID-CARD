import { isLightTextColor } from '../lib/readableText'
import type { EidCardState } from './types'

type CardSignatureProps = {
  card: EidCardState
  /** Use full-width rule (e.g. Islamic) or short bar */
  divider?: 'full' | 'short'
}

/**
 * Shared signature block: name + optional designation (hidden when empty).
 * Designation uses a pill so it reads clearly on busy backgrounds.
 */
export function CardSignature({ card, divider = 'short' }: CardSignatureProps) {
  const accent = card.accentColor
  const dividerWidth = divider === 'full' ? '100%' : 'min(220px, 100%)'
  const nameShadow = isLightTextColor(card.textColor)
    ? '0 0 2px rgba(0,0,0,0.88), 0 1px 3px rgba(0,0,0,0.9), 0 4px 18px rgba(0,0,0,0.55)'
    : '0 0 2px rgba(255,255,255,0.95), 0 1px 2px rgba(255,255,255,0.6), 0 4px 16px rgba(255,255,255,0.35)'

  return (
    <>
      <div
        className={divider === 'full' ? 'mt-[16px]' : 'mt-[12px]'}
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
          'mt-[18px] text-[32px] leading-[1.15] tracking-[-0.02em]',
          card.boldText ? 'font-extrabold' : 'font-semibold',
        ].join(' ')}
        style={{
          fontWeight: card.boldText ? 800 : 600,
          textShadow: nameShadow,
        }}
      >
        {card.userName}
      </div>
      {card.designation ? (
        <div className="mt-[14px] flex flex-wrap items-center gap-2">
          <span
            className="inline-block rounded-full px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]"
            style={{
              color: card.textColor,
              backgroundColor: 'rgba(255,255,255,0.08)',
              border: `1px solid ${accent}55`,
              boxShadow: '0 2px 16px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.06)',
              backdropFilter: 'blur(6px)',
            }}
          >
            {card.designation}
          </span>
        </div>
      ) : null}
    </>
  )
}
