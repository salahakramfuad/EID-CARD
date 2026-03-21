import { CrescentIcon, SparkleIcon, StarIcon } from './icons'
import { CardSignature } from './signature'
import type { EidCardState, EidTemplate } from './types'

function DecorationOverlay({ card }: { card: EidCardState }) {
  const colorStyle = { color: card.accentColor }

  return (
    <div aria-hidden="true" className="absolute inset-0" style={colorStyle}>
      {card.decorations.stars ? (
        <>
          <div className="absolute left-[78px] top-[120px] h-[22px] w-[22px] opacity-85">
            <StarIcon className="h-full w-full" />
          </div>
          <div className="absolute right-[110px] top-[190px] h-[18px] w-[18px] opacity-75">
            <StarIcon className="h-full w-full" />
          </div>
          <div className="absolute left-[140px] bottom-[150px] h-[16px] w-[16px] opacity-70">
            <StarIcon className="h-full w-full" />
          </div>
        </>
      ) : null}

      {card.decorations.moons ? (
        <>
          <div className="absolute right-[160px] bottom-[250px] h-[28px] w-[28px] opacity-80">
            <CrescentIcon className="h-full w-full" />
          </div>
          <div className="absolute left-[190px] top-[260px] h-[20px] w-[20px] opacity-65">
            <CrescentIcon className="h-full w-full" />
          </div>
        </>
      ) : null}

      {card.decorations.sparkles ? (
        <>
          <div className="absolute right-[240px] top-[300px] h-[18px] w-[18px] opacity-90">
            <SparkleIcon className="h-full w-full" />
          </div>
          <div className="absolute left-[220px] bottom-[210px] h-[14px] w-[14px] opacity-70">
            <SparkleIcon className="h-full w-full" />
          </div>
        </>
      ) : null}
    </div>
  )
}

const elegantTemplate: EidTemplate = {
  id: 'elegant',
  name: 'Elegant',
  styleKey: 'elegant',
  description: 'Soft gold accents with ornate lines',
  thumbnail: (active: boolean) => (
    <div
      className={[
        'h-16 w-24 rounded-xl border p-2 flex flex-col justify-center gap-1',
        active ? 'border-zinc-900/70 dark:border-zinc-100/80' : 'border-zinc-300/60 dark:border-zinc-700/60',
        active ? 'bg-amber-50/70 dark:bg-amber-950/20' : 'bg-amber-50/30 dark:bg-amber-950/10',
      ].join(' ')}
    >
      <div className="h-2 w-16 rounded bg-amber-500/70" />
      <div className="h-2 w-20 rounded bg-amber-400/50" />
      <div className="h-2 w-12 rounded bg-amber-300/30" />
    </div>
  ),
  render: (card: EidCardState) => {
    return (
      <div className="absolute inset-0">
        {/* Elegant frame + corner ornaments */}
        <div
          aria-hidden="true"
          className="absolute inset-x-[130px] top-[86px] h-[54px] rounded-full blur-2xl"
          style={{ backgroundColor: card.accentColor, opacity: 0.16 }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-[42px] rounded-[30px] border-[2px]"
          style={{ borderColor: card.accentColor, opacity: 0.14 }}
        />

        <div
          aria-hidden="true"
          className="absolute left-[56px] top-[56px] h-[10px] w-[10px] rounded-full"
          style={{ backgroundColor: card.accentColor, opacity: 0.18 }}
        />
        <div
          aria-hidden="true"
          className="absolute right-[56px] top-[56px] h-[10px] w-[10px] rounded-full"
          style={{ backgroundColor: card.accentColor, opacity: 0.18 }}
        />
        <div
          aria-hidden="true"
          className="absolute left-[56px] bottom-[56px] h-[10px] w-[10px] rounded-full"
          style={{ backgroundColor: card.accentColor, opacity: 0.18 }}
        />
        <div
          aria-hidden="true"
          className="absolute right-[56px] bottom-[56px] h-[10px] w-[10px] rounded-full"
          style={{ backgroundColor: card.accentColor, opacity: 0.18 }}
        />

        {/* Ornate lines */}
        <svg
          aria-hidden="true"
          viewBox="0 0 720 1080"
          className="absolute inset-0 opacity-25"
          style={{ color: card.accentColor }}
        >
          <path
            d="M90 188 C 164 106, 240 106, 314 188"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M406 244 C 482 162, 560 162, 636 244"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M130 856 C 200 786, 280 786, 350 856"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M390 790 C 454 730, 520 730, 584 790"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
          />
        </svg>

        <DecorationOverlay card={card} />

        {/* Content */}
        <div
          style={{ fontFamily: card.fontFamily, color: card.textColor }}
          className="relative z-10 h-full px-[72px] pt-[170px] pb-[92px] flex flex-col"
        >
          <div className="text-[54px] leading-[1] tracking-[-0.9px] font-semibold drop-shadow-[0_10px_24px_rgba(0,0,0,0.10)]">
            {card.title}
          </div>

          <div className="mt-[18px] text-[30px] leading-[1.3] font-medium whitespace-pre-wrap opacity-95">
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

export default elegantTemplate

