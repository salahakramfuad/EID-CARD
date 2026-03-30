import { cardMessageClass, cardTitleClass } from '../lib/cardTypography'
import {
  CrescentIcon,
  HexOutlineIcon,
  InterlacedSquareIcon,
  KhatamStarIcon,
  SparkleIcon,
  StarIcon,
} from './icons'
import { IslamicArabesqueBand, IslamicCornerFrame } from './islamicOrnaments'
import { CardSignature } from './signature'
import type { EidCardState, EidTemplate } from './types'

function DecorationOverlay({ card }: { card: EidCardState }) {
  const colorStyle = { color: card.accentColor }

  return (
    <div aria-hidden="true" className="absolute inset-0" style={colorStyle}>
      {/* Always-on subtle geometry for Islamic template richness */}
      <div className="absolute left-[200px] top-[380px] h-[26px] w-[26px] opacity-[0.42]">
        <KhatamStarIcon className="h-full w-full" />
      </div>
      <div className="absolute right-[185px] top-[460px] h-[22px] w-[22px] opacity-[0.38]">
        <InterlacedSquareIcon className="h-full w-full" />
      </div>
      <div className="absolute left-[240px] bottom-[320px] h-[24px] w-[24px] opacity-[0.35]">
        <HexOutlineIcon className="h-full w-full" />
      </div>
      <div className="absolute right-[260px] top-[620px] h-[20px] w-[20px] opacity-[0.36]">
        <KhatamStarIcon className="h-full w-full" />
      </div>

      {card.decorations.moons ? (
        <>
          <div className="absolute left-[72px] top-[92px] h-[32px] w-[32px] opacity-[0.72]">
            <CrescentIcon className="h-full w-full" />
          </div>
          <div className="absolute right-[92px] top-[170px] h-[22px] w-[22px] opacity-[0.58]">
            <CrescentIcon className="h-full w-full" />
          </div>
          <div className="absolute right-[150px] bottom-[180px] h-[28px] w-[28px] opacity-[0.62]">
            <CrescentIcon className="h-full w-full" />
          </div>
        </>
      ) : null}

      {card.decorations.stars ? (
        <>
          <div className="absolute left-[155px] top-[250px] h-[18px] w-[18px] opacity-[0.58]">
            <StarIcon className="h-full w-full" />
          </div>
          <div className="absolute right-[140px] top-[330px] h-[20px] w-[20px] opacity-[0.52]">
            <StarIcon className="h-full w-full" />
          </div>
          <div className="absolute left-[110px] bottom-[120px] h-[16px] w-[16px] opacity-50">
            <StarIcon className="h-full w-full" />
          </div>
          <div className="absolute right-[320px] top-[200px] h-[19px] w-[19px] opacity-[0.45]">
            <KhatamStarIcon className="h-full w-full" />
          </div>
        </>
      ) : null}

      {card.decorations.sparkles ? (
        <>
          <div className="absolute right-[190px] bottom-[250px] h-[20px] w-[20px] opacity-[0.55]">
            <SparkleIcon className="h-full w-full" />
          </div>
          <div className="absolute left-[180px] top-[420px] h-[14px] w-[14px] opacity-[0.48]">
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
  description: 'Girih patterns, mihrab, and khatam stars',
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
          className="absolute inset-0 rounded-[36px]"
          style={{
            border: `2px solid ${card.accentColor}`,
            opacity: 0.11,
          }}
        />

        <svg
          aria-hidden="true"
          viewBox="0 0 720 1080"
          className="absolute inset-0 opacity-[0.22]"
          style={{ color: card.accentColor }}
        >
          <defs>
            <pattern id="islGeoDiamond" width="56" height="56" patternUnits="userSpaceOnUse">
              <path
                d="M28 0 L56 28 L28 56 L0 28 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.15"
                opacity="0.5"
              />
              <path
                d="M28 14 L42 28 L28 42 L14 28 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.9"
                opacity="0.32"
              />
            </pattern>
            <symbol id="islSymKhatam" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M12 2 22 12 12 22 2 12ZM12 6 18 12 12 18 6 12Z"
                opacity="0.55"
              />
            </symbol>
            <pattern id="islGeoKhatam" width="72" height="72" patternUnits="userSpaceOnUse">
              <use href="#islSymKhatam" width="20" height="20" x="26" y="26" />
              <use href="#islSymKhatam" width="12" height="12" x="4" y="8" opacity="0.65" />
              <use href="#islSymKhatam" width="12" height="12" x="52" y="48" opacity="0.65" />
            </pattern>
            <pattern id="islHexMesh" width="44" height="76.4" patternUnits="userSpaceOnUse">
              <path
                d="M22 4L38 14V34L22 44L6 34V14Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.85"
                opacity="0.4"
              />
            </pattern>
          </defs>
          <rect width="720" height="1080" fill="url(#islGeoDiamond)" opacity="0.4" />
          <rect width="720" height="1080" fill="url(#islGeoKhatam)" opacity="0.28" />
          <rect width="720" height="1080" fill="url(#islHexMesh)" opacity="0.18" />
        </svg>

        {/* Arches */}
        <svg
          aria-hidden="true"
          viewBox="0 0 720 1080"
          className="absolute inset-0 opacity-[0.28]"
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
          className="absolute inset-0 opacity-[0.2]"
          style={{ color: card.accentColor }}
        >
          <path d="M46 930 C 132 876, 210 876, 292 930" fill="none" stroke="currentColor" strokeWidth="2.2" />
          <path d="M430 930 C 512 876, 590 876, 674 930" fill="none" stroke="currentColor" strokeWidth="2.2" />
          <path
            d="M 360 1008 Q 300 984 248 1008 M 360 1008 Q 420 984 472 1008"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            opacity="0.55"
          />
          <path fill="currentColor" fillRule="evenodd" opacity="0.35" d="M360 992L368 1000 360 1008 352 1000Z" />
        </svg>

        <IslamicCornerFrame
          accentColor={card.accentColor}
          opacity={0.19}
          className="pointer-events-none absolute inset-0"
        />

        <DecorationOverlay card={card} />

        <div
          style={{ fontFamily: card.fontFamily, color: card.textColor }}
          className="relative z-10 flex h-full flex-col px-[68px] pt-[168px] pb-[96px]"
        >
          {/* Mihrab ornament */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-[72px] -translate-x-1/2 opacity-[0.72]"
            style={{ color: card.accentColor }}
          >
            <svg viewBox="0 0 260 128" className="h-[96px] w-[236px]">
              <defs>
                <linearGradient id="islMihrabSheen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={card.accentColor} stopOpacity={0.18} />
                  <stop offset="100%" stopColor={card.accentColor} stopOpacity={0.82} />
                </linearGradient>
              </defs>
              <path
                d="M130 8 L175 44 C188 56 190 78 178 98 C166 116 140 122 118 114 C96 106 84 86 88 64 C92 46 108 32 118 28 L130 8 Z"
                fill="rgba(255,255,255,0.04)"
                stroke="url(#islMihrabSheen)"
                strokeWidth="2"
              />
              <path
                d="M130 22 L158 48 C166 56 168 72 160 88 C150 104 126 108 108 98 C90 88 84 70 90 54 C94 42 106 34 114 30 L130 22 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.35"
                opacity="0.55"
              />
              <path d="M102 46 V 96 M158 46 V 96" fill="none" stroke="currentColor" strokeWidth="1.1" opacity="0.45" />
              <path
                d="M130 34 L138 42 L130 52 L122 42 Z M130 38 L134 42 L130 46 L126 42 Z"
                fill="currentColor"
                fillRule="evenodd"
                opacity="0.5"
              />
              <circle cx="130" cy="102" r="3" fill="currentColor" opacity="0.35" />
            </svg>
          </div>

          <div className={cardTitleClass(card.boldText, card.textColor)}>{card.title}</div>
          <div className={cardMessageClass(card.boldText, card.textColor)}>{card.message}</div>
          <div className="mt-auto flex flex-col pt-[28px] pb-14">
            <IslamicArabesqueBand
              accentColor={card.accentColor}
              opacity={0.32}
              className="mb-3 h-10 w-full max-w-[580px] self-center"
            />
            <CardSignature card={card} divider="full" />
          </div>
        </div>
      </div>
    )
  },
}

export default islamicTemplate

