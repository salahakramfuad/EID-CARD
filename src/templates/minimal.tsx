import { cardMessageClass, cardTitleClass } from '../lib/cardTypography'
import { CrescentIcon, HexOutlineIcon, KhatamStarIcon, SparkleIcon, StarIcon } from './icons'
import { CardSignature } from './signature'
import type { EidCardState, EidTemplate } from './types'

function DecorationOverlay({ card }: { card: EidCardState }) {
  const colorStyle = { color: card.accentColor }
  return (
    <div aria-hidden="true" className="absolute inset-0" style={colorStyle}>
      {card.decorations.stars ? (
        <>
          <div className="absolute left-[86px] top-[86px] h-[18px] w-[18px] opacity-80">
            <StarIcon className="h-full w-full" />
          </div>
          <div className="absolute right-[96px] top-[180px] h-[14px] w-[14px] opacity-70">
            <StarIcon className="h-full w-full" />
          </div>
          <div className="absolute left-[130px] bottom-[116px] h-[14px] w-[14px] opacity-65">
            <StarIcon className="h-full w-full" />
          </div>
        </>
      ) : null}
      {card.decorations.moons ? (
        <>
          <div className="absolute right-[120px] bottom-[190px] h-[18px] w-[18px] opacity-70">
            <CrescentIcon className="h-full w-full" />
          </div>
        </>
      ) : null}
      {card.decorations.sparkles ? (
        <>
          <div className="absolute left-[190px] top-[280px] h-[16px] w-[16px] opacity-70">
            <SparkleIcon className="h-full w-full" />
          </div>
        </>
      ) : null}
      <div className="absolute left-[58px] top-[200px] h-[20px] w-[20px] opacity-[0.26]">
        <KhatamStarIcon className="h-full w-full" />
      </div>
      <div className="absolute right-[62px] bottom-[220px] h-[18px] w-[18px] opacity-[0.24]">
        <HexOutlineIcon className="h-full w-full" />
      </div>
    </div>
  )
}

const minimalTemplate: EidTemplate = {
  id: 'minimal',
  name: 'Minimal',
  styleKey: 'minimal',
  description: 'Monochrome elegance with subtle accents',
  thumbnail: (active: boolean) => (
    <div
      className={[
        'h-16 w-24 rounded-xl border p-2 flex flex-col justify-center gap-1',
        active ? 'border-zinc-900 dark:border-zinc-100' : 'border-zinc-300/60 dark:border-zinc-700/60',
      ].join(' ')}
    >
      <div className="h-2 w-16 rounded bg-zinc-900/20 dark:bg-zinc-100/20" />
      <div className="h-2 w-12 rounded bg-zinc-900/10 dark:bg-zinc-100/10" />
      <div className="h-2 w-8 rounded bg-zinc-900/15 dark:bg-zinc-100/15" />
    </div>
  ),
  render: (card: EidCardState) => {
    return (
      <div className="absolute inset-0">
        <div className="absolute inset-0 border border-white/[0.07]" />
        <div
          aria-hidden="true"
          className="absolute inset-[20px] rounded-[30px] border"
          style={{ borderColor: card.accentColor, opacity: 0.16 }}
        />
        <svg
          aria-hidden="true"
          viewBox="0 0 720 1080"
          className="absolute inset-0 opacity-[0.16]"
          style={{ color: card.accentColor }}
        >
          <path d="M92 140 C 180 82, 258 82, 344 140" fill="none" stroke="currentColor" strokeWidth="2.2" />
          <path d="M376 140 C 462 82, 540 82, 628 140" fill="none" stroke="currentColor" strokeWidth="2.2" />
        </svg>

        <DecorationOverlay card={card} />

        <div
          style={{ fontFamily: card.fontFamily, color: card.textColor }}
          className="relative z-10 flex h-full flex-col px-[68px] pt-[178px] pb-[96px]"
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

export default minimalTemplate

