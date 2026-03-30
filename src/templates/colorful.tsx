import { cardMessageClass, cardTitleClass } from '../lib/cardTypography'
import { CrescentIcon, InterlacedSquareIcon, KhatamStarIcon, SparkleIcon, StarIcon } from './icons'
import { CardSignature } from './signature'
import type { EidCardState, EidTemplate } from './types'

function DotField() {
  // Deterministic pseudo-confetti for consistent export across sessions.
  // Uses fixed positions instead of randomness.
  const dots = [
    [80, 120, 6],
    [150, 168, 4],
    [220, 135, 5],
    [300, 205, 3],
    [380, 130, 5],
    [460, 160, 4],
    [540, 120, 6],
    [610, 205, 4],
    [120, 320, 4],
    [200, 410, 6],
    [290, 350, 4],
    [370, 430, 5],
    [470, 390, 3],
    [550, 460, 5],
    [620, 410, 4],
    [100, 720, 5],
    [190, 810, 4],
    [260, 760, 3],
    [360, 840, 6],
    [490, 770, 4],
    [580, 820, 5],
    [650, 740, 3],
  ] as const

  const colors = [
    'rgba(255,255,255,0.38)',
    'rgba(255,255,255,0.26)',
    'rgba(255,255,255,0.44)',
    'rgba(255,255,255,0.22)',
  ] as const

  return (
    <div aria-hidden="true" className="absolute inset-0">
      {dots.map(([x, y, r], idx) => (
        <span
          // eslint-disable-next-line react/no-array-index-key
          key={idx}
          className="absolute rounded-full"
          style={{
            left: x,
            top: y,
            width: r,
            height: r,
            background: colors[idx % colors.length],
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
      {card.decorations.stars ? (
        <>
          <div className="absolute left-[80px] top-[90px] h-[26px] w-[26px] opacity-95">
            <StarIcon className="h-full w-full" />
          </div>
          <div className="absolute right-[120px] top-[140px] h-[20px] w-[20px] opacity-80">
            <StarIcon className="h-full w-full" />
          </div>
          <div className="absolute left-[170px] bottom-[150px] h-[18px] w-[18px] opacity-70">
            <StarIcon className="h-full w-full" />
          </div>
        </>
      ) : null}

      {card.decorations.moons ? (
        <>
          <div className="absolute right-[190px] bottom-[240px] h-[30px] w-[30px] opacity-80">
            <CrescentIcon className="h-full w-full" />
          </div>
        </>
      ) : null}

      {card.decorations.sparkles ? (
        <>
          <div className="absolute right-[200px] top-[260px] h-[18px] w-[18px] opacity-95">
            <SparkleIcon className="h-full w-full" />
          </div>
          <div className="absolute left-[250px] top-[320px] h-[14px] w-[14px] opacity-70">
            <SparkleIcon className="h-full w-full" />
          </div>
          <div className="absolute right-[320px] bottom-[170px] h-[16px] w-[16px] opacity-80">
            <SparkleIcon className="h-full w-full" />
          </div>
        </>
      ) : null}
    </div>
  )
}

const colorfulTemplate: EidTemplate = {
  id: 'colorful',
  name: 'Colorful',
  styleKey: 'colorful',
  description: 'Vibrant confetti and bold energy',
  thumbnail: (active: boolean) => (
    <div
      className={[
        'h-16 w-24 rounded-xl border p-2 flex items-center justify-center',
        active ? 'border-zinc-900 dark:border-zinc-100' : 'border-zinc-300/60 dark:border-zinc-700/60',
      ].join(' ')}
    >
      <div className="h-10 w-full rounded-lg bg-gradient-to-r from-pink-500 via-yellow-400 to-cyan-500" />
    </div>
  ),
  render: (card: EidCardState) => {
    return (
      <div className="absolute inset-0">
        <div
          aria-hidden="true"
          className="absolute inset-x-[70px] top-[78px] h-[70px] rounded-full blur-2xl"
          style={{ backgroundColor: card.accentColor, opacity: 0.14 }}
        />
        <svg
          aria-hidden="true"
          viewBox="0 0 720 1080"
          className="absolute inset-0 opacity-[0.16]"
          style={{ color: card.accentColor }}
        >
          <path d="M24 250 C 120 210, 205 210, 300 250 C 390 288, 480 288, 690 230" fill="none" stroke="currentColor" strokeWidth="2.4" />
        </svg>
        <DotField />

        <DecorationOverlay card={card} />
        <div
          aria-hidden="true"
          className="absolute right-[72px] top-[200px] h-[30px] w-[30px] opacity-[0.26]"
          style={{ color: card.accentColor }}
        >
          <KhatamStarIcon className="h-full w-full" />
        </div>
        <div
          aria-hidden="true"
          className="absolute left-[88px] bottom-[260px] h-[26px] w-[26px] opacity-[0.22]"
          style={{ color: card.accentColor }}
        >
          <InterlacedSquareIcon className="h-full w-full" />
        </div>

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

export default colorfulTemplate

