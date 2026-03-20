import { CrescentIcon, SparkleIcon, StarIcon } from './icons'
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
        <div className="absolute inset-0 border border-zinc-900/10" />
        <div
          aria-hidden="true"
          className="absolute inset-[22px] rounded-[28px] border"
          style={{ borderColor: card.accentColor, opacity: 0.22 }}
        />
        <svg
          aria-hidden="true"
          viewBox="0 0 720 1080"
          className="absolute inset-0 opacity-20"
          style={{ color: card.accentColor }}
        >
          <path d="M92 140 C 180 82, 258 82, 344 140" fill="none" stroke="currentColor" strokeWidth="2.2" />
          <path d="M376 140 C 462 82, 540 82, 628 140" fill="none" stroke="currentColor" strokeWidth="2.2" />
        </svg>

        <DecorationOverlay card={card} />

        <div className="relative z-10 h-full px-[72px] pt-[176px] pb-[94px] flex flex-col">
          <div style={{ fontFamily: card.fontFamily, color: card.textColor }}>
            <div className="text-[54px] leading-[1] tracking-[-0.8px] font-semibold">
              {card.title}
            </div>

            <div className="mt-[20px] text-[30px] leading-[1.3] font-medium whitespace-pre-wrap opacity-95">
              {card.message}
            </div>

            <div className="mt-auto pt-[32px]">
              <div
                className="mt-[14px] h-[2px] w-[220px] rounded-full"
                style={{ backgroundColor: card.accentColor, opacity: 0.25 }}
              />
              <div className="mt-[18px] text-[30px] font-extrabold tracking-[-0.2px]">
                {card.userName}
              </div>
              {card.designation ? (
                <div className="mt-[6px] text-[18px] font-medium tracking-[0.6px] opacity-90">
                  {card.designation}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    )
  },
}

export default minimalTemplate

