import type { ReactNode } from 'react'
import { cardMessageClass, cardTitleClass } from '../lib/cardTypography'
import { animalArtImageStyle } from '../lib/animalImageStyle'
import { GOAT_ART_FILE } from '../lib/animalAssets'
import { publicAssetUrl } from '../lib/publicAssetUrl'
import { CrescentIcon, SparkleIcon, StarIcon } from './icons'
import { IslamicCornerFrame } from './islamicOrnaments'
import { CardSignatureCompact } from './signature'
import type { EidCardState } from './types'
import type { IslamicCardVariant } from './islamicCardLayout'

const GOAT_ART_SRC = publicAssetUrl(GOAT_ART_FILE)

function GoatDecorationOverlay({ card }: { card: EidCardState }) {
  const colorStyle = { color: card.accentColor }
  return (
    <div aria-hidden="true" className="absolute inset-0" style={colorStyle}>
      {card.decorations.moons ? (
        <div className="absolute right-[40px] top-[100px] h-[22px] w-[22px] opacity-50">
          <CrescentIcon className="h-full w-full" />
        </div>
      ) : null}
      {card.decorations.stars ? (
        <div className="absolute left-[44px] top-[160px] h-[16px] w-[16px] opacity-45">
          <StarIcon className="h-full w-full" />
        </div>
      ) : null}
      {card.decorations.sparkles ? (
        <div className="absolute left-[48px] bottom-[220px] h-[14px] w-[14px] opacity-45">
          <SparkleIcon className="h-full w-full" />
        </div>
      ) : null}
    </div>
  )
}

/**
 * Goat theme: title on top, message left + portrait right, signature below.
 */
export function renderGoatCard(card: EidCardState, variant: IslamicCardVariant): ReactNode {
  const accent = card.accentColor
  const imgStyle = animalArtImageStyle(card.textColor, accent)

  return (
    <div className="absolute inset-0">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-[28%] h-[420px] w-[min(58%,400px)] opacity-50"
        style={{
          background: `radial-gradient(ellipse at 70% 50%, ${accent}44 0%, transparent 70%)`,
        }}
      />

      <div
        aria-hidden="true"
        className="absolute inset-[18px] rounded-[28px]"
        style={{ border: `1.5px solid ${accent}`, opacity: variant.frameOpacity + 0.04 }}
      />

      <IslamicCornerFrame accentColor={accent} opacity={0.14} className="pointer-events-none absolute inset-0" />

      <GoatDecorationOverlay card={card} />

      <div
        style={{ fontFamily: card.fontFamily, color: card.textColor }}
        className="relative z-10 flex h-full flex-col px-[44px] pb-[72px] pt-[88px]"
      >
        <header className="shrink-0 text-center">
          <div className={cardTitleClass(card.boldText, card.textColor)}>{card.title}</div>
        </header>

        <div className="mt-6 flex min-h-0 flex-1 items-center gap-4">
          <div className="flex min-w-0 flex-1 flex-col justify-center pr-1">
            <div className={[cardMessageClass(card.boldText, card.textColor), 'mt-0 text-left'].join(' ')}>
              {card.message}
            </div>
          </div>

          <div className="flex w-[min(46%,300px)] shrink-0 items-center justify-center">
            <img
              src={GOAT_ART_SRC}
              alt=""
              draggable={false}
              data-animal-hero="goat"
              className="max-h-[min(38vh,360px)] w-full object-contain object-center"
              style={imgStyle}
            />
          </div>
        </div>

      </div>

      <CardSignatureCompact
        card={card}
        className="pointer-events-none absolute bottom-[88px] left-[48px] z-20"
      />
    </div>
  )
}
