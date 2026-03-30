import { cardMessageClass, cardTitleClass } from '../lib/cardTypography'
import { CrescentIcon, KhatamStarIcon, SparkleIcon, StarIcon } from './icons'
import { CardSignature } from './signature'
import type { EidCardState, EidTemplate } from './types'

function DecorationOverlay({
  card,
}: {
  card: EidCardState
}) {
  const colorStyle = { color: card.accentColor }

  return (
    <div aria-hidden="true" className="absolute inset-0" style={colorStyle}>
      {card.decorations.stars ? (
        <>
          <div className="absolute left-[70px] top-[70px] h-[26px] w-[26px] opacity-[0.72]">
            <StarIcon className="h-full w-full" />
          </div>
          <div className="absolute right-[80px] top-[120px] h-[22px] w-[22px] opacity-[0.65]">
            <StarIcon className="h-full w-full" />
          </div>
          <div className="absolute left-[140px] bottom-[120px] h-[20px] w-[20px] opacity-[0.58]">
            <StarIcon className="h-full w-full" />
          </div>
        </>
      ) : null}

      {card.decorations.moons ? (
        <>
          <div className="absolute right-[120px] bottom-[220px] h-[26px] w-[26px] opacity-[0.65]">
            <CrescentIcon className="h-full w-full" />
          </div>
          <div className="absolute left-[100px] top-[220px] h-[20px] w-[20px] opacity-[0.58]">
            <CrescentIcon className="h-full w-full" />
          </div>
        </>
      ) : null}

      {card.decorations.sparkles ? (
        <>
          <div className="absolute right-[140px] top-[260px] h-[20px] w-[20px] opacity-[0.7]">
            <SparkleIcon className="h-full w-full" />
          </div>
          <div className="absolute left-[190px] top-[300px] h-[16px] w-[16px] opacity-[0.55]">
            <SparkleIcon className="h-full w-full" />
          </div>
          <div className="absolute right-[240px] bottom-[170px] h-[18px] w-[18px] opacity-[0.6]">
            <SparkleIcon className="h-full w-full" />
          </div>
        </>
      ) : null}
      <div className="absolute right-[64px] top-[340px] h-[28px] w-[28px] opacity-[0.28]">
        <KhatamStarIcon className="h-full w-full" />
      </div>
    </div>
  )
}

const modernTemplate: EidTemplate = {
  id: 'modern',
  name: 'Modern',
  styleKey: 'modern',
  description: 'Gradient glow with subtle ornaments',
  thumbnail: (active: boolean) => (
    <div
      className={[
        'h-16 w-24 rounded-xl border p-2 flex flex-col justify-center gap-1',
        active ? 'border-zinc-900 dark:border-zinc-100' : 'border-zinc-300/60 dark:border-zinc-700/60',
      ].join(' ')}
    >
      <div className="h-2 w-10 rounded bg-gradient-to-r from-sky-500 to-violet-500" />
      <div className="h-2 w-16 rounded bg-gradient-to-r from-fuchsia-500 to-cyan-500" />
      <div className="h-2 w-8 rounded bg-zinc-900/20 dark:bg-zinc-100/20" />
    </div>
  ),
  render: (card: EidCardState) => {
    return (
      <div className="absolute inset-0">
        <div
          aria-hidden="true"
          className="absolute -top-[90px] left-1/2 h-[320px] w-[320px] -translate-x-1/2 rounded-full blur-3xl"
          style={{ backgroundColor: card.accentColor, opacity: 0.14 }}
        />
        <svg
          aria-hidden="true"
          viewBox="0 0 720 1080"
          className="absolute inset-0 opacity-[0.16]"
          style={{ color: card.accentColor }}
        >
          <path d="M0 980 C 120 930, 220 930, 340 980 C 460 1030, 560 1030, 720 980" fill="none" stroke="currentColor" strokeWidth="3" />
          <g opacity="0.14" transform="translate(360 520)">
            <g transform="scale(11) translate(-12 -12)">
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M12 2 22 12 12 22 2 12ZM12 6 18 12 12 18 6 12Z"
              />
            </g>
          </g>
          <g opacity="0.1" transform="translate(120 280) rotate(22)">
            <g transform="scale(5) translate(-12 -12)">
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                d="M12 2 22 12 12 22 2 12zM12 6 18 12 12 18 6 12z"
              />
            </g>
          </g>
        </svg>
        <DecorationOverlay card={card} />

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

export default modernTemplate

