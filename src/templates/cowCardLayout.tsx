import type { ReactNode } from 'react'
import { cardMessageClass, cardTitleClass } from '../lib/cardTypography'
import { animalArtImageStyle } from '../lib/animalImageStyle'
import { BULL_ART_FILE } from '../lib/animalAssets'
import { publicAssetUrl } from '../lib/publicAssetUrl'
import { isLightTextColor } from '../lib/readableText'
import { CrescentIcon, SparkleIcon, StarIcon } from './icons'
import { IslamicCornerFrame } from './islamicOrnaments'
import { CardSignatureBottomLeft } from './signature'
import type { EidCardState } from './types'
import type { IslamicCardVariant } from './islamicCardLayout'

const BULL_ART_SRC = publicAssetUrl(BULL_ART_FILE)

function CowDecorationOverlay({ card }: { card: EidCardState }) {
  const colorStyle = { color: card.accentColor }
  return (
    <div aria-hidden="true" className="absolute inset-0" style={colorStyle}>
      {card.decorations.moons ? (
        <div className="absolute left-[40px] top-[96px] h-[22px] w-[22px] opacity-50">
          <CrescentIcon className="h-full w-full" />
        </div>
      ) : null}
      {card.decorations.stars ? (
        <div className="absolute right-[44px] top-[130px] h-[16px] w-[16px] opacity-45">
          <StarIcon className="h-full w-full" />
        </div>
      ) : null}
      {card.decorations.sparkles ? (
        <div className="absolute right-[48px] top-[200px] h-[14px] w-[14px] opacity-45">
          <SparkleIcon className="h-full w-full" />
        </div>
      ) : null}
    </div>
  )
}

export function renderCowCard(card: EidCardState, variant: IslamicCardVariant): ReactNode {
  const accent = card.accentColor
  const imgStyle = animalArtImageStyle(card.textColor, accent)
  const lightText = isLightTextColor(card.textColor)

  return (
    <div className="absolute inset-0">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[4] h-[min(55%,580px)]"
        style={{
          background: lightText
            ? 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 75%)'
            : `radial-gradient(ellipse 95% 75% at 50% 100%, ${accent}55 0%, transparent 70%)`,
        }}
      />

      <div
        aria-hidden="true"
        className="absolute inset-[18px] rounded-[28px]"
        style={{ border: `1.5px solid ${accent}`, opacity: variant.frameOpacity + 0.04 }}
      />

      <IslamicCornerFrame accentColor={accent} opacity={0.14} className="pointer-events-none absolute inset-0" />

      <CowDecorationOverlay card={card} />

      <div
        style={{ fontFamily: card.fontFamily, color: card.textColor }}
        className="relative z-10 flex h-full flex-col px-[48px] pb-[min(48vh,420px)] pt-[84px]"
      >
        <header className="shrink-0 text-center">
          <div className={cardTitleClass(card.boldText, card.textColor)}>{card.title}</div>
        </header>

        <div className="mx-auto mt-4 w-full max-w-[540px] flex-1 text-center">
          <div className={cardMessageClass(card.boldText, card.textColor)}>{card.message}</div>
        </div>
      </div>

      <CardSignatureBottomLeft card={card} />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[-8%] bottom-0 z-[8] flex items-end justify-center"
      >
        <img
          src={BULL_ART_SRC}
          alt=""
          draggable={false}
          data-animal-hero="cow"
          className="h-[min(52vh,480px)] w-full max-w-[800px] object-contain object-bottom"
          style={imgStyle}
        />
      </div>
    </div>
  )
}
