import { CrescentIcon, SparkleIcon, StarIcon } from './icons'
import type { EidCardState, EidTemplate } from './types'

const titleSize = 'text-[56px] leading-[0.98] tracking-[-1px]'
const messageSize = 'text-[30px] leading-[1.28]'
const nameSize = 'text-[30px] leading-[1]'

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
          <div className="absolute left-[70px] top-[70px] h-[26px] w-[26px] opacity-90">
            <StarIcon className="h-full w-full" />
          </div>
          <div className="absolute right-[80px] top-[120px] h-[22px] w-[22px] opacity-80">
            <StarIcon className="h-full w-full" />
          </div>
          <div className="absolute left-[140px] bottom-[120px] h-[20px] w-[20px] opacity-70">
            <StarIcon className="h-full w-full" />
          </div>
        </>
      ) : null}

      {card.decorations.moons ? (
        <>
          <div className="absolute right-[120px] bottom-[220px] h-[26px] w-[26px] opacity-80">
            <CrescentIcon className="h-full w-full" />
          </div>
          <div className="absolute left-[100px] top-[220px] h-[20px] w-[20px] opacity-70">
            <CrescentIcon className="h-full w-full" />
          </div>
        </>
      ) : null}

      {card.decorations.sparkles ? (
        <>
          <div className="absolute right-[140px] top-[260px] h-[20px] w-[20px] opacity-90">
            <SparkleIcon className="h-full w-full" />
          </div>
          <div className="absolute left-[190px] top-[300px] h-[16px] w-[16px] opacity-70">
            <SparkleIcon className="h-full w-full" />
          </div>
          <div className="absolute right-[240px] bottom-[170px] h-[18px] w-[18px] opacity-75">
            <SparkleIcon className="h-full w-full" />
          </div>
        </>
      ) : null}
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
          style={{ backgroundColor: card.accentColor, opacity: 0.18 }}
        />
        <svg
          aria-hidden="true"
          viewBox="0 0 720 1080"
          className="absolute inset-0 opacity-20"
          style={{ color: card.accentColor }}
        >
          <path d="M0 980 C 120 930, 220 930, 340 980 C 460 1030, 560 1030, 720 980" fill="none" stroke="currentColor" strokeWidth="3" />
        </svg>
        <DecorationOverlay card={card} />

        <div className="relative z-10 h-full px-[72px] pt-[170px] pb-[92px] flex flex-col">
          <div
            className="text-[0px]"
            style={{ fontFamily: card.fontFamily, color: card.textColor }}
          />

          <div style={{ fontFamily: card.fontFamily, color: card.textColor }}>
            <div className={titleSize} style={{ textShadow: '0 10px 30px rgba(0,0,0,0.12)' }}>
              {card.title}
            </div>

            <div className={`mt-[20px] ${messageSize} font-medium whitespace-pre-wrap`}>
              {card.message}
            </div>

            <div className="mt-auto pt-[32px]">
              <div
                className="mt-[10px] h-[3px] w-[220px] rounded-full"
                style={{ backgroundColor: card.accentColor, opacity: 0.30 }}
              />
              <div className={`${nameSize} mt-[18px]`} style={{ fontWeight: 800 }}>
                {card.userName}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
}

export default modernTemplate

