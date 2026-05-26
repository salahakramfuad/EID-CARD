import type { ReactNode } from 'react'
import { cardMessageClass, cardTitleClass } from '../lib/cardTypography'
import { CrescentIcon, SparkleIcon, StarIcon } from './icons'
import { IslamicArabesqueBand, IslamicCornerFrame } from './islamicOrnaments'
import { CardSignature } from './signature'
import type { EidCardState } from './types'
import type { IslamicCardVariant } from './islamicCardLayout'

type HeroAnimalCardOptions = {
  imageSrc: string
  /** For export debugging / asset wait hooks */
  dataAttr: string
  /**
   * `screen` hides solid black backdrops on photo backgrounds (goat sketch).
   * `normal` for transparent PNG line art (cow).
   */
  imageBlendMode?: 'normal' | 'screen'
}

function HeroDecorationOverlay({ card }: { card: EidCardState }) {
  const colorStyle = { color: card.accentColor }
  return (
    <div aria-hidden="true" className="absolute inset-0" style={colorStyle}>
      {card.decorations.moons ? (
        <div className="absolute right-[48px] top-[100px] h-[24px] w-[24px] opacity-50">
          <CrescentIcon className="h-full w-full" />
        </div>
      ) : null}
      {card.decorations.stars ? (
        <>
          <div className="absolute left-[52px] top-[140px] h-[16px] w-[16px] opacity-45">
            <StarIcon className="h-full w-full" />
          </div>
          <div className="absolute right-[56px] bottom-[280px] h-[14px] w-[14px] opacity-40">
            <StarIcon className="h-full w-full" />
          </div>
        </>
      ) : null}
      {card.decorations.sparkles ? (
        <div className="absolute left-[48px] bottom-[300px] h-[14px] w-[14px] opacity-45">
          <SparkleIcon className="h-full w-full" />
        </div>
      ) : null}
    </div>
  )
}

/**
 * Hero animal layout: title → centered portrait → message → signature.
 */
export function renderHeroAnimalCard(
  card: EidCardState,
  variant: IslamicCardVariant,
  options: HeroAnimalCardOptions,
): ReactNode {
  const accent = card.accentColor
  const blend = options.imageBlendMode ?? 'normal'

  return (
    <div className="absolute inset-0">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[42%] h-[440px] w-[540px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-55"
        style={{
          background: `radial-gradient(ellipse at center, ${accent}40 0%, transparent 70%)`,
        }}
      />

      <div
        aria-hidden="true"
        className="absolute inset-[18px] rounded-[28px]"
        style={{
          border: `1.5px solid ${accent}`,
          opacity: variant.frameOpacity + 0.04,
        }}
      />

      <IslamicCornerFrame accentColor={accent} opacity={0.14} className="pointer-events-none absolute inset-0" />

      <HeroDecorationOverlay card={card} />

      <div
        style={{ fontFamily: card.fontFamily, color: card.textColor }}
        className="relative z-10 flex h-full flex-col px-[52px] pb-[84px] pt-[96px]"
      >
        <header className="shrink-0 text-center">
          <div className={cardTitleClass(card.boldText, card.textColor)}>{card.title}</div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col items-center justify-center py-1">
          <img
            src={options.imageSrc}
            alt=""
            draggable={false}
            data-animal-hero={options.dataAttr}
            className={[
              'w-full max-w-[min(94%,400px)] object-contain object-center',
              blend === 'screen'
                ? 'max-h-[min(50%,420px)] mix-blend-screen'
                : 'max-h-[min(46%,380px)] drop-shadow-[0_16px_48px_rgba(0,0,0,0.4)]',
            ].join(' ')}
            style={{
              filter: blend === 'normal' ? `drop-shadow(0 0 32px ${accent}66)` : undefined,
            }}
          />
        </div>

        <div className="mx-auto w-full max-w-[580px] shrink-0 text-center">
          <div className={cardMessageClass(card.boldText, card.textColor)}>{card.message}</div>
        </div>

        <footer className="mt-auto flex shrink-0 flex-col pt-5">
          <IslamicArabesqueBand
            accentColor={accent}
            opacity={variant.bandOpacity}
            className="mb-3 h-9 w-full max-w-[520px] self-center"
          />
          <CardSignature card={card} divider={variant.divider} />
        </footer>
      </div>
    </div>
  )
}
