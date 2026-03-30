import { cardMessageClass, cardTitleClass } from '../lib/cardTypography'
import { CrescentIcon, HexOutlineIcon, KhatamStarIcon, SparkleIcon, StarIcon } from './icons'
import { ElegantFiligreeCorners } from './islamicOrnaments'
import { CardSignature } from './signature'
import type { EidCardState, EidTemplate } from './types'

function DecorationOverlay({ card }: { card: EidCardState }) {
  const colorStyle = { color: card.accentColor }

  return (
    <div aria-hidden="true" className="absolute inset-0" style={colorStyle}>
      {card.decorations.stars ? (
        <>
          <div className="absolute left-[78px] top-[120px] h-[22px] w-[22px] opacity-85">
            <StarIcon className="h-full w-full" />
          </div>
          <div className="absolute right-[110px] top-[190px] h-[18px] w-[18px] opacity-75">
            <StarIcon className="h-full w-full" />
          </div>
          <div className="absolute left-[140px] bottom-[150px] h-[16px] w-[16px] opacity-70">
            <StarIcon className="h-full w-full" />
          </div>
        </>
      ) : null}

      {card.decorations.moons ? (
        <>
          <div className="absolute right-[160px] bottom-[250px] h-[28px] w-[28px] opacity-80">
            <CrescentIcon className="h-full w-full" />
          </div>
          <div className="absolute left-[190px] top-[260px] h-[20px] w-[20px] opacity-65">
            <CrescentIcon className="h-full w-full" />
          </div>
        </>
      ) : null}

      {card.decorations.sparkles ? (
        <>
          <div className="absolute right-[240px] top-[300px] h-[18px] w-[18px] opacity-90">
            <SparkleIcon className="h-full w-full" />
          </div>
          <div className="absolute left-[220px] bottom-[210px] h-[14px] w-[14px] opacity-70">
            <SparkleIcon className="h-full w-full" />
          </div>
        </>
      ) : null}
      <div className="absolute left-1/2 top-[156px] h-[26px] w-[26px] -translate-x-1/2 opacity-[0.4]">
        <KhatamStarIcon className="h-full w-full" />
      </div>
      <div className="absolute left-[124px] top-[420px] h-[22px] w-[22px] opacity-[0.32]">
        <HexOutlineIcon className="h-full w-full" />
      </div>
      <div className="absolute right-[118px] bottom-[380px] h-[24px] w-[24px] opacity-[0.34]">
        <KhatamStarIcon className="h-full w-full" />
      </div>
    </div>
  )
}

const elegantTemplate: EidTemplate = {
  id: 'elegant',
  name: 'Elegant',
  styleKey: 'elegant',
  description: 'Soft gold accents with ornate lines',
  thumbnail: (active: boolean) => (
    <div
      className={[
        'h-16 w-24 rounded-xl border p-2 flex flex-col justify-center gap-1',
        active ? 'border-zinc-900/70 dark:border-zinc-100/80' : 'border-zinc-300/60 dark:border-zinc-700/60',
        active ? 'bg-amber-50/70 dark:bg-amber-950/20' : 'bg-amber-50/30 dark:bg-amber-950/10',
      ].join(' ')}
    >
      <div className="h-2 w-16 rounded bg-amber-500/70" />
      <div className="h-2 w-20 rounded bg-amber-400/50" />
      <div className="h-2 w-12 rounded bg-amber-300/30" />
    </div>
  ),
  render: (card: EidCardState) => {
    return (
      <div className="absolute inset-0">
        {/* Elegant frame + corner ornaments */}
        <div
          aria-hidden="true"
          className="absolute inset-x-[130px] top-[86px] h-[54px] rounded-full blur-2xl"
          style={{ backgroundColor: card.accentColor, opacity: 0.12 }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-[40px] rounded-[32px] border"
          style={{ borderColor: card.accentColor, opacity: 0.11 }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-[52px] rounded-[26px] border"
          style={{ borderColor: card.accentColor, opacity: 0.08 }}
        />

        <ElegantFiligreeCorners
          accentColor={card.accentColor}
          opacity={0.22}
          className="pointer-events-none absolute inset-0"
        />

        <div
          aria-hidden="true"
          className="absolute left-[52px] top-[52px] h-[8px] w-[8px] rounded-full"
          style={{ backgroundColor: card.accentColor, opacity: 0.14 }}
        />
        <div
          aria-hidden="true"
          className="absolute right-[52px] top-[52px] h-[8px] w-[8px] rounded-full"
          style={{ backgroundColor: card.accentColor, opacity: 0.14 }}
        />
        <div
          aria-hidden="true"
          className="absolute left-[52px] bottom-[52px] h-[8px] w-[8px] rounded-full"
          style={{ backgroundColor: card.accentColor, opacity: 0.14 }}
        />
        <div
          aria-hidden="true"
          className="absolute right-[52px] bottom-[52px] h-[8px] w-[8px] rounded-full"
          style={{ backgroundColor: card.accentColor, opacity: 0.14 }}
        />

        {/* Ornate lines */}
        <svg
          aria-hidden="true"
          viewBox="0 0 720 1080"
          className="absolute inset-0 opacity-[0.19]"
          style={{ color: card.accentColor }}
        >
          <defs>
            <linearGradient id="elgArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.15" />
              <stop offset="40%" stopColor="currentColor" stopOpacity="0.65" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <path
            d="M90 188 C 164 106, 240 106, 314 188"
            stroke="url(#elgArcGrad)"
            strokeWidth="2.25"
            fill="none"
          />
          <path
            d="M406 244 C 482 162, 560 162, 636 244"
            stroke="url(#elgArcGrad)"
            strokeWidth="2.25"
            fill="none"
          />
          <path
            d="M130 856 C 200 786, 280 786, 350 856"
            stroke="url(#elgArcGrad)"
            strokeWidth="2.25"
            fill="none"
          />
          <path
            d="M390 790 C 454 730, 520 730, 584 790"
            stroke="url(#elgArcGrad)"
            strokeWidth="2.25"
            fill="none"
          />
          <path
            d="M360 208 C 320 198 300 218 300 248 C 300 280 328 298 360 292 C 392 298 420 280 420 248 C 420 218 400 198 360 208 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.15"
            opacity="0.35"
          />
        </svg>

        <DecorationOverlay card={card} />

        {/* Content */}
        <div
          style={{ fontFamily: card.fontFamily, color: card.textColor }}
          className="relative z-10 flex h-full flex-col px-[68px] pt-[176px] pb-[96px]"
        >
          <div className={cardTitleClass(card.boldText, card.textColor)}>{card.title}</div>
          <div className={cardMessageClass(card.boldText, card.textColor)}>{card.message}</div>
          <div className="mt-auto flex flex-col pt-[28px] pb-14">
            <CardSignature card={card} divider="short" />
          </div>
        </div>
      </div>
    )
  },
}

export default elegantTemplate

