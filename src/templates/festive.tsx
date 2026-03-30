import { cardMessageClass, cardTitleClass } from '../lib/cardTypography'
import { CrescentIcon, KhatamStarIcon, SparkleIcon, StarIcon } from './icons'
import { CardSignature } from './signature'
import type { EidCardState, EidTemplate } from './types'

function ConfettiField() {
  // Deterministic set of confetti dots (stable for PNG export).
  const pieces = [
    [80, 100, 6, 'rgba(255,255,255,0.42)'],
    [150, 160, 5, 'rgba(255,255,255,0.32)'],
    [210, 115, 4, 'rgba(255,255,255,0.38)'],
    [290, 182, 5, 'rgba(255,255,255,0.28)'],
    [360, 132, 4, 'rgba(255,255,255,0.4)'],
    [440, 165, 5, 'rgba(255,255,255,0.3)'],
    [520, 122, 5, 'rgba(255,255,255,0.38)'],
    [590, 170, 4, 'rgba(255,255,255,0.28)'],
    [660, 142, 5, 'rgba(255,255,255,0.34)'],
    [95, 340, 5, 'rgba(255,255,255,0.38)'],
    [180, 430, 5, 'rgba(255,255,255,0.28)'],
    [250, 370, 4, 'rgba(255,255,255,0.32)'],
    [340, 420, 5, 'rgba(255,255,255,0.38)'],
    [460, 370, 4, 'rgba(255,255,255,0.28)'],
    [540, 430, 5, 'rgba(255,255,255,0.34)'],
    [640, 390, 4, 'rgba(255,255,255,0.3)'],
    [110, 740, 5, 'rgba(255,255,255,0.38)'],
    [195, 860, 4, 'rgba(255,255,255,0.3)'],
    [270, 795, 5, 'rgba(255,255,255,0.34)'],
    [360, 885, 4, 'rgba(255,255,255,0.3)'],
    [450, 800, 5, 'rgba(255,255,255,0.26)'],
    [540, 880, 5, 'rgba(255,255,255,0.32)'],
    [635, 815, 4, 'rgba(255,255,255,0.28)'],
  ] as const

  return (
    <div aria-hidden="true" className="absolute inset-0">
      {pieces.map(([x, y, r, c], idx) => (
        <span
          // eslint-disable-next-line react/no-array-index-key
          key={idx}
          className="absolute rounded-full"
          style={{
            left: x,
            top: y,
            width: r,
            height: r,
            background: c,
            boxShadow: '0 0 0 1px rgba(0,0,0,0.02) inset',
          }}
        />
      ))}
    </div>
  )
}

function DecorationOverlay({ card }: { card: EidCardState }) {
  const colorStyle = { color: card.accentColor }
  return (
    <div aria-hidden="true" className="absolute inset-0" style={colorStyle}>
      {card.decorations.sparkles ? (
        <>
          <div className="absolute right-[120px] top-[140px] h-[20px] w-[20px] opacity-95">
            <SparkleIcon className="h-full w-full" />
          </div>
          <div className="absolute left-[200px] top-[250px] h-[15px] w-[15px] opacity-75">
            <SparkleIcon className="h-full w-full" />
          </div>
          <div className="absolute right-[240px] bottom-[170px] h-[17px] w-[17px] opacity-85">
            <SparkleIcon className="h-full w-full" />
          </div>
        </>
      ) : null}

      {card.decorations.stars ? (
        <>
          <div className="absolute left-[90px] top-[160px] h-[24px] w-[24px] opacity-85">
            <StarIcon className="h-full w-full" />
          </div>
          <div className="absolute right-[160px] bottom-[250px] h-[18px] w-[18px] opacity-75">
            <StarIcon className="h-full w-full" />
          </div>
        </>
      ) : null}

      {card.decorations.moons ? (
        <>
          <div className="absolute right-[140px] top-[260px] h-[30px] w-[30px] opacity-75">
            <CrescentIcon className="h-full w-full" />
          </div>
          <div className="absolute left-[150px] bottom-[210px] h-[22px] w-[22px] opacity-70">
            <CrescentIcon className="h-full w-full" />
          </div>
        </>
      ) : null}
    </div>
  )
}

const festiveTemplate: EidTemplate = {
  id: 'festive',
  name: 'Festive',
  styleKey: 'festive',
  description: 'Bold gradient with celebration confetti',
  thumbnail: (active: boolean) => (
    <div
      className={[
        'h-16 w-24 rounded-xl border p-2 flex flex-col justify-center gap-1',
        active ? 'border-zinc-900/70 dark:border-zinc-100/80' : 'border-zinc-300/60 dark:border-zinc-700/60',
        active ? 'bg-fuchsia-100/70 dark:bg-fuchsia-950/20' : 'bg-fuchsia-100/30 dark:bg-fuchsia-950/10',
      ].join(' ')}
    >
      <div className="h-2 w-14 rounded bg-gradient-to-r from-fuchsia-500 to-pink-400" />
      <div className="h-2 w-20 rounded bg-gradient-to-r from-yellow-300 to-cyan-300" />
      <div className="h-2 w-10 rounded bg-white/50" />
    </div>
  ),
  render: (card: EidCardState) => {
    return (
      <div className="absolute inset-0">
        <svg
          aria-hidden="true"
          viewBox="0 0 720 1080"
          className="absolute inset-0 opacity-[0.17]"
          style={{ color: card.accentColor }}
        >
          <path d="M36 210 C 130 160, 220 160, 315 210 C 410 260, 500 260, 684 188" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <path d="M24 980 C 130 930, 220 930, 320 980 C 420 1030, 520 1030, 696 968" fill="none" stroke="currentColor" strokeWidth="2.5" />
        </svg>
        <ConfettiField />
        <DecorationOverlay card={card} />
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-[128px] h-[36px] w-[36px] -translate-x-1/2 opacity-[0.22]"
          style={{ color: card.accentColor }}
        >
          <KhatamStarIcon className="h-full w-full" />
        </div>

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

export default festiveTemplate

