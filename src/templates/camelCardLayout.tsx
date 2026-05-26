import type { ReactNode } from 'react'
import { cardMessageClass, cardTitleClass } from '../lib/cardTypography'
import { CAMEL_ART_FILE } from '../lib/animalAssets'
import { publicAssetUrl } from '../lib/publicAssetUrl'
import { isLightTextColor } from '../lib/readableText'
import { CrescentIcon, SparkleIcon, StarIcon } from './icons'
import { IslamicCornerFrame } from './islamicOrnaments'
import { CardSignatureBottomLeft } from './signature'
import type { EidCardState } from './types'
import type { IslamicCardVariant } from './islamicCardLayout'

const CAMEL_ART_SRC = publicAssetUrl(CAMEL_ART_FILE)

function CamelDecorationOverlay({ card }: { card: EidCardState }) {
  const colorStyle = { color: card.accentColor }
  return (
    <div aria-hidden="true" className="absolute inset-0" style={colorStyle}>
      {card.decorations.moons ? (
        <div className="absolute right-[44px] top-[76px] h-[24px] w-[24px] opacity-50">
          <CrescentIcon className="h-full w-full" />
        </div>
      ) : null}
      {card.decorations.stars ? (
        <div className="absolute left-[48px] top-[108px] h-[16px] w-[16px] opacity-45">
          <StarIcon className="h-full w-full" />
        </div>
      ) : null}
      {card.decorations.sparkles ? (
        <div className="absolute right-[40px] top-[188px] h-[14px] w-[14px] opacity-45">
          <SparkleIcon className="h-full w-full" />
        </div>
      ) : null}
    </div>
  )
}

export function renderCamelCard(card: EidCardState, variant: IslamicCardVariant): ReactNode {
  const accent = card.accentColor
  const lightText = isLightTextColor(card.textColor)

  return (
    <div className="absolute inset-0">
      {lightText ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-[3] h-[300px]"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.42) 0%, transparent 100%)' }}
        />
      ) : null}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[4] h-[min(48%,480px)]"
        style={{
          background: lightText
            ? 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.28) 42%, transparent 88%)'
            : `linear-gradient(to top, ${accent}50 0%, ${accent}18 35%, transparent 82%)`,
        }}
      />

      <div
        aria-hidden="true"
        className="absolute inset-[18px] rounded-[28px]"
        style={{ border: `1.5px solid ${accent}`, opacity: variant.frameOpacity + 0.04 }}
      />

      <IslamicCornerFrame accentColor={accent} opacity={0.14} className="pointer-events-none absolute inset-0" />

      <CamelDecorationOverlay card={card} />

      <div
        style={{ fontFamily: card.fontFamily, color: card.textColor }}
        className="relative z-10 flex h-full flex-col px-[48px] pb-[min(34vh,280px)] pt-[80px]"
      >
        <header className="shrink-0 text-center">
          <div className={cardTitleClass(card.boldText, card.textColor)}>{card.title}</div>
        </header>

        <div className="mx-auto mt-5 w-full max-w-[560px] flex-1 text-center">
          <div className={[cardMessageClass(card.boldText, card.textColor), 'mt-0'].join(' ')}>
            {card.message}
          </div>
        </div>
      </div>

      <CardSignatureBottomLeft card={card} />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[-4%] bottom-[-1%] z-[8] flex items-end justify-center"
      >
        <img
          src={CAMEL_ART_SRC}
          alt=""
          draggable={false}
          data-animal-hero="camel"
          className="h-[min(36vh,300px)] w-full max-w-[640px] object-contain object-bottom"
          style={{
            filter: lightText
              ? [
                  `drop-shadow(0 0 28px ${accent}55)`,
                  'drop-shadow(0 6px 28px rgba(0,0,0,0.42))',
                ].join(' ')
              : ['brightness(0)', `drop-shadow(0 0 24px ${accent}44)`].join(' '),
          }}
        />
      </div>
    </div>
  )
}
