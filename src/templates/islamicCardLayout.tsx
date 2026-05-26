import type { ReactNode } from 'react'
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
import type { AdhaAnimalKind, EidCardState } from './types'

export type IslamicCardVariant = {
  /** Unique prefix for SVG pattern ids when multiple templates mount in dev */
  patternPrefix: string
  animal: AdhaAnimalKind
  defaultAccent: string
  bandOpacity: number
  divider: 'full' | 'short'
  frameOpacity: number
  skylineOpacity: number
  showLanterns: boolean
}

function DecorationOverlay({ card }: { card: EidCardState }) {
  const colorStyle = { color: card.accentColor }

  return (
    <div aria-hidden="true" className="absolute inset-0" style={colorStyle}>
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

export function renderIslamicCard(card: EidCardState, variant: IslamicCardVariant): ReactNode {
  const p = variant.patternPrefix

  return (
    <div className="absolute inset-0">
      <svg
        aria-hidden="true"
        viewBox="0 0 720 1080"
        className="pointer-events-none absolute inset-0 z-2"
        style={{
          color: card.accentColor,
          opacity: variant.showLanterns ? variant.skylineOpacity : 0,
        }}
      >
        {variant.showLanterns ? (
          <>
            <path d="M62 228h2v130h-2zM656 238h2v120h-2z" fill="currentColor" opacity="0.45" />
            <path
              d="M48 356h30l-7 14v24l-8 8H53l-8-8v-24zM642 350h30l-7 14v24l-8 8h-10l-8-8v-24z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M120 820 C 192 764, 278 764, 352 820 C 426 764, 510 764, 584 820"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              opacity="0.4"
            />
            <path
              d="M64 906 L118 872 L164 906 Z M146 906 L210 862 L274 906 Z M254 906 L320 852 L388 906 Z M376 906 L450 858 L522 906 Z M498 906 L562 868 L626 906 Z"
              fill="currentColor"
              opacity="0.2"
            />
            <path
              d="M560 102 C 590 78 632 94 637 132 C 642 168 608 193 574 184 C 599 176 617 153 612 127 C 607 101 584 91 560 102 Z"
              fill="currentColor"
              opacity="0.6"
            />
            <path
              d="M102 892 C 110 878 128 874 142 881 C 158 889 165 908 160 924 C 156 940 140 952 122 952 C 107 951 92 942 86 927 C 98 932 112 934 124 929 C 134 924 140 914 138 903 C 136 893 128 887 119 886 C 113 885 107 887 102 892 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.3"
              opacity="0.55"
            />
            <circle cx="127" cy="902" r="2.8" fill="currentColor" opacity="0.55" />
          </>
        ) : null}
      </svg>

      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-[36px]"
        style={{
          border: `2px solid ${card.accentColor}`,
          opacity: variant.frameOpacity,
        }}
      />

      <svg
        aria-hidden="true"
        viewBox="0 0 720 1080"
        className="absolute inset-0 opacity-[0.22]"
        style={{ color: card.accentColor }}
      >
        <defs>
          <pattern id={`${p}GeoDiamond`} width="56" height="56" patternUnits="userSpaceOnUse">
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
          <symbol id={`${p}SymKhatam`} viewBox="0 0 24 24">
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M12 2 22 12 12 22 2 12ZM12 6 18 12 12 18 6 12Z"
              opacity="0.55"
            />
          </symbol>
          <pattern id={`${p}GeoKhatam`} width="72" height="72" patternUnits="userSpaceOnUse">
            <use href={`#${p}SymKhatam`} width="20" height="20" x="26" y="26" />
            <use href={`#${p}SymKhatam`} width="12" height="12" x="4" y="8" opacity="0.65" />
            <use href={`#${p}SymKhatam`} width="12" height="12" x="52" y="48" opacity="0.65" />
          </pattern>
          <pattern id={`${p}HexMesh`} width="44" height="76.4" patternUnits="userSpaceOnUse">
            <path
              d="M22 4L38 14V34L22 44L6 34V14Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.85"
              opacity="0.4"
            />
          </pattern>
        </defs>
        <rect width="720" height="1080" fill={`url(#${p}GeoDiamond)`} opacity="0.4" />
        <rect width="720" height="1080" fill={`url(#${p}GeoKhatam)`} opacity="0.28" />
        <rect width="720" height="1080" fill={`url(#${p}HexMesh)`} opacity="0.18" />
      </svg>

      <svg aria-hidden="true" viewBox="0 0 720 1080" className="absolute inset-0 opacity-[0.28]">
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
        opacity={variant.frameOpacity + 0.08}
        className="pointer-events-none absolute inset-0"
      />

      <DecorationOverlay card={card} />

      <div
        style={{ fontFamily: card.fontFamily, color: card.textColor }}
        className="relative z-10 flex h-full flex-col px-[68px] pt-[168px] pb-[96px]"
      >
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-[72px] -translate-x-1/2 opacity-[0.72]"
          style={{ color: card.accentColor }}
        >
          <svg viewBox="0 0 260 128" className="h-[96px] w-[236px]">
            <defs>
              <linearGradient id={`${p}MihrabSheen`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={card.accentColor} stopOpacity={0.18} />
                <stop offset="100%" stopColor={card.accentColor} stopOpacity={0.82} />
              </linearGradient>
            </defs>
            <path
              d="M130 8 L175 44 C188 56 190 78 178 98 C166 116 140 122 118 114 C96 106 84 86 88 64 C92 46 108 32 118 28 L130 8 Z"
              fill="rgba(255,255,255,0.04)"
              stroke={`url(#${p}MihrabSheen)`}
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
            opacity={variant.bandOpacity}
            className="mb-3 h-10 w-full max-w-[580px] self-center"
          />
          <CardSignature card={card} divider={variant.divider} />
        </div>
      </div>
    </div>
  )
}

export function createAdhaThumbnail(
  active: boolean,
  barClasses: [string, string, string],
): ReactNode {
  return (
    <div
      className={[
        'flex h-16 w-24 flex-col justify-center gap-1 rounded-xl border p-2',
        active ? 'border-zinc-900 dark:border-zinc-100' : 'border-zinc-300/60 dark:border-zinc-700/60',
      ].join(' ')}
    >
      <div className={['h-2 w-16 rounded', barClasses[0]].join(' ')} />
      <div className={['h-2 w-12 rounded', barClasses[1]].join(' ')} />
      <div className={['h-2 w-8 rounded', barClasses[2]].join(' ')} />
    </div>
  )
}
