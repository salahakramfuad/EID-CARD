import { CrescentIcon, SparkleIcon, StarIcon } from './icons'
import { CardSignature } from './signature'
import type { EidCardState, EidTemplate } from './types'

function DecorationOverlay({ card }: { card: EidCardState }) {
  const colorStyle = { color: card.accentColor }

  return (
    <div aria-hidden="true" className="absolute inset-0" style={colorStyle}>
      {card.decorations.moons ? (
        <>
          <div className="absolute left-[72px] top-[92px] h-[32px] w-[32px] opacity-85">
            <CrescentIcon className="h-full w-full" />
          </div>
          <div className="absolute right-[92px] top-[170px] h-[22px] w-[22px] opacity-70">
            <CrescentIcon className="h-full w-full" />
          </div>
          <div className="absolute right-[150px] bottom-[180px] h-[28px] w-[28px] opacity-75">
            <CrescentIcon className="h-full w-full" />
          </div>
        </>
      ) : null}

      {card.decorations.stars ? (
        <>
          <div className="absolute left-[155px] top-[250px] h-[18px] w-[18px] opacity-80">
            <StarIcon className="h-full w-full" />
          </div>
          <div className="absolute right-[140px] top-[330px] h-[20px] w-[20px] opacity-70">
            <StarIcon className="h-full w-full" />
          </div>
          <div className="absolute left-[110px] bottom-[120px] h-[16px] w-[16px] opacity-65">
            <StarIcon className="h-full w-full" />
          </div>
        </>
      ) : null}

      {card.decorations.sparkles ? (
        <>
          <div className="absolute right-[190px] bottom-[250px] h-[20px] w-[20px] opacity-90">
            <SparkleIcon className="h-full w-full" />
          </div>
          <div className="absolute left-[180px] top-[420px] h-[14px] w-[14px] opacity-70">
            <SparkleIcon className="h-full w-full" />
          </div>
        </>
      ) : null}
    </div>
  )
}

const islamicTemplate: EidTemplate = {
  id: 'islamic',
  name: 'Islamic',
  styleKey: 'islamic',
  description: 'Geometric arches with a serene tone',
  thumbnail: (active: boolean) => (
    <div
      className={[
        'h-16 w-24 rounded-xl border p-2 flex flex-col justify-center gap-1',
        active ? 'border-zinc-900 dark:border-zinc-100' : 'border-zinc-300/60 dark:border-zinc-700/60',
      ].join(' ')}
    >
      <div className="h-2 w-16 rounded bg-emerald-600/70" />
      <div className="h-2 w-12 rounded bg-emerald-500/40" />
      <div className="h-2 w-8 rounded bg-emerald-300/40" />
    </div>
  ),
  render: (card: EidCardState) => {
    return (
      <div className="absolute inset-0">
        {/* Frame + subtle geometric pattern */}
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-[32px]"
          style={{
            border: `2px solid ${card.accentColor}`,
            opacity: 0.14,
          }}
        />

        <svg
          aria-hidden="true"
          viewBox="0 0 720 1080"
          className="absolute inset-0 opacity-25"
          style={{ color: card.accentColor }}
        >
          <defs>
            <pattern id="geo" width="56" height="56" patternUnits="userSpaceOnUse">
              <path
                d="M28 0 L56 28 L28 56 L0 28 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                opacity="0.55"
              />
              <path
                d="M28 14 L42 28 L28 42 L14 28 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                opacity="0.35"
              />
            </pattern>
          </defs>
          <rect width="720" height="1080" fill="url(#geo)" opacity="0.45" />
        </svg>

        {/* Arches */}
        <svg
          aria-hidden="true"
          viewBox="0 0 720 1080"
          className="absolute inset-0 opacity-35"
        >
          <path
            d="M96 156 C 156 100, 240 100, 300 156 L 300 316 C 252 268, 144 268, 96 316 Z"
            fill="rgba(255,255,255,0.08)"
          />
          <path
            d="M420 186 C 480 126, 564 126, 624 186 L 624 346 C 576 298, 468 298, 420 346 Z"
            fill="rgba(255,255,255,0.07)"
          />
          <path
            d="M120 696 C 186 636, 264 636, 330 696 L 330 906 C 280 860, 170 860, 120 906 Z"
            fill="rgba(255,255,255,0.05)"
          />
          <path
            d="M378 636 C 450 576, 540 576, 612 636 L 612 876 C 552 836, 418 836, 378 876 Z"
            fill="rgba(255,255,255,0.04)"
          />
        </svg>
        <svg
          aria-hidden="true"
          viewBox="0 0 720 1080"
          className="absolute inset-0 opacity-22"
          style={{ color: card.accentColor }}
        >
          <path d="M46 930 C 132 876, 210 876, 292 930" fill="none" stroke="currentColor" strokeWidth="2.2" />
          <path d="M430 930 C 512 876, 590 876, 674 930" fill="none" stroke="currentColor" strokeWidth="2.2" />
        </svg>

        <DecorationOverlay card={card} />

        <div
          style={{ fontFamily: card.fontFamily, color: card.textColor }}
          className="relative z-10 h-full px-[72px] pt-[170px] pb-[94px] flex flex-col"
        >
          {/* Mihrab ornament */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-[78px] -translate-x-1/2 opacity-65"
            style={{ color: card.accentColor }}
          >
            <svg viewBox="0 0 240 120" className="h-[88px] w-[220px]">
              <path
                d="M120 6 L160 36 C172 50 172 72 160 96 C148 112 92 112 80 96 C68 72 68 50 80 36 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                opacity="0.9"
              />
              <path
                d="M120 24 L140 40 C147 49 147 62 140 76 C132 90 108 90 100 76 C93 62 93 49 100 40 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                opacity="0.55"
              />
            </svg>
          </div>

          <div className="text-[54px] leading-[1] tracking-[-0.9px] font-semibold drop-shadow-[0_10px_24px_rgba(0,0,0,0.35)]">
            {card.title}
          </div>

          <div className="mt-[18px] text-[30px] leading-[1.3] font-medium whitespace-pre-wrap opacity-95">
            {card.message}
          </div>

          <div className="mt-auto flex flex-col pt-[32px] pb-14">
            <CardSignature card={card} divider="full" />
          </div>
        </div>
      </div>
    )
  },
}

export default islamicTemplate

