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
  return (
    <>
      <div
        className={divider === 'full' ? 'mt-[14px] h-[2px] w-full rounded-full' : 'mt-[10px] h-[3px] w-[240px] max-w-full rounded-full'}
        style={{
          backgroundColor: card.accentColor,
          opacity: divider === 'full' ? 0.75 : 0.35,
        }}
      />
      <div
        className="mt-[20px] text-[34px] font-extrabold leading-[1.08] tracking-[-0.03em]"
        style={{
          fontWeight: 800,
          textShadow: '0 2px 18px rgba(0,0,0,0.35)',
        }}
      >
        {card.userName}
      </div>
      {card.designation ? (
        <div className="mt-[12px] flex flex-wrap items-center gap-2">
          <span
            className="inline-block rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em]"
            style={{
              color: card.textColor,
              backgroundColor: 'rgba(0,0,0,0.22)',
              border: `1px solid ${card.accentColor}99`,
              boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
            }}
          >
            {card.designation}
          </span>
        </div>
      ) : null}
    </>
  )
}
