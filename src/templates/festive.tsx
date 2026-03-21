import { CrescentIcon, SparkleIcon, StarIcon } from './icons'
import { CardSignature } from './signature'
import type { EidCardState, EidTemplate } from './types'

function ConfettiField() {
  // Deterministic set of confetti dots (stable for PNG export).
  const pieces = [
    [80, 100, 7, 'rgba(255,255,255,0.65)'],
    [150, 160, 6, 'rgba(255,255,255,0.45)'],
    [210, 115, 5, 'rgba(255,255,255,0.55)'],
    [290, 182, 6, 'rgba(255,255,255,0.35)'],
    [360, 132, 5, 'rgba(255,255,255,0.60)'],
    [440, 165, 7, 'rgba(255,255,255,0.40)'],
    [520, 122, 6, 'rgba(255,255,255,0.55)'],
    [590, 170, 5, 'rgba(255,255,255,0.35)'],
    [660, 142, 6, 'rgba(255,255,255,0.45)'],
    [95, 340, 6, 'rgba(255,255,255,0.55)'],
    [180, 430, 7, 'rgba(255,255,255,0.35)'],
    [250, 370, 5, 'rgba(255,255,255,0.45)'],
    [340, 420, 6, 'rgba(255,255,255,0.55)'],
    [460, 370, 5, 'rgba(255,255,255,0.35)'],
    [540, 430, 6, 'rgba(255,255,255,0.48)'],
    [640, 390, 5, 'rgba(255,255,255,0.42)'],
    [110, 740, 7, 'rgba(255,255,255,0.55)'],
    [195, 860, 5, 'rgba(255,255,255,0.40)'],
    [270, 795, 6, 'rgba(255,255,255,0.48)'],
    [360, 885, 5, 'rgba(255,255,255,0.42)'],
    [450, 800, 7, 'rgba(255,255,255,0.35)'],
    [540, 880, 6, 'rgba(255,255,255,0.45)'],
    [635, 815, 5, 'rgba(255,255,255,0.40)'],
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
          className="absolute inset-0 opacity-22"
          style={{ color: card.accentColor }}
        >
          <path d="M36 210 C 130 160, 220 160, 315 210 C 410 260, 500 260, 684 188" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <path d="M24 980 C 130 930, 220 930, 320 980 C 420 1030, 520 1030, 696 968" fill="none" stroke="currentColor" strokeWidth="2.5" />
        </svg>
        <ConfettiField />
        <DecorationOverlay card={card} />

        <div
          style={{ fontFamily: card.fontFamily, color: card.textColor }}
          className="relative z-10 h-full px-[72px] pt-[170px] pb-[92px] flex flex-col"
        >
          <div className="text-[56px] leading-[0.98] tracking-[-0.9px] font-extrabold drop-shadow-[0_10px_24px_rgba(0,0,0,0.18)]">
            {card.title}
          </div>

          <div className="mt-[20px] text-[30px] leading-[1.3] font-semibold whitespace-pre-wrap drop-shadow-[0_10px_24px_rgba(0,0,0,0.12)]">
            {card.message}
          </div>

          <div className="mt-auto flex flex-col pt-[32px] pb-14">
            <CardSignature card={card} divider="short" />
          </div>
        </div>
      </div>
    )
  },
}

export default festiveTemplate

