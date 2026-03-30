import { cardMessageClass, cardTitleClass } from '../lib/cardTypography'
import { CrescentIcon, HexOutlineIcon, KhatamStarIcon, SparkleIcon, StarIcon } from './icons'
import { CardSignature } from './signature'
import type { EidCardState, EidTemplate } from './types'

function MoonlightOverlay({ card }: { card: EidCardState }) {
  return (
    <div aria-hidden="true" className="absolute inset-0">
      <div className="absolute -top-[120px] left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full blur-3xl" style={{ backgroundColor: card.accentColor, opacity: 0.12 }} />
      <svg viewBox="0 0 720 1080" className="absolute inset-0" style={{ color: card.accentColor, opacity: 0.18 }}>
        <path d="M0 940 C 90 900, 170 900, 260 940 C 350 980, 430 980, 520 940 C 590 910, 650 910, 720 940 L720 1080 L0 1080 Z" fill="currentColor" opacity="0.26" />
        <path d="M0 975 C 80 940, 165 940, 250 975 C 335 1010, 420 1010, 505 975 C 590 940, 650 940, 720 975" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
      <div className="absolute left-[74px] top-[172px] h-[52px] w-[52px]" style={{ color: card.accentColor, opacity: 0.72 }}>
        <CrescentIcon className="h-full w-full" />
      </div>
      <div className="absolute right-[92px] top-[212px] h-[22px] w-[22px]" style={{ color: card.accentColor, opacity: 0.68 }}>
        <SparkleIcon className="h-full w-full" />
      </div>
      <div className="absolute left-[154px] top-[268px] h-[14px] w-[14px]" style={{ color: card.accentColor, opacity: 0.62 }}>
        <StarIcon className="h-full w-full" />
      </div>
      <div className="absolute right-[166px] bottom-[246px] h-[20px] w-[20px]" style={{ color: card.accentColor, opacity: 0.58 }}>
        <StarIcon className="h-full w-full" />
      </div>
      <div className="absolute left-[200px] top-[320px] h-[32px] w-[32px]" style={{ color: card.accentColor, opacity: 0.38 }}>
        <KhatamStarIcon className="h-full w-full" />
      </div>
      <div className="absolute right-[210px] top-[380px] h-[26px] w-[26px]" style={{ color: card.accentColor, opacity: 0.32 }}>
        <HexOutlineIcon className="h-full w-full" />
      </div>
      <div className="absolute left-[420px] bottom-[320px] h-[24px] w-[24px]" style={{ color: card.accentColor, opacity: 0.34 }}>
        <KhatamStarIcon className="h-full w-full" />
      </div>
    </div>
  )
}

const moonlightTemplate: EidTemplate = {
  id: 'moonlight',
  name: 'Moonlight',
  styleKey: 'moonlight',
  description: 'Night sky glow with crescent elegance',
  thumbnail: (active: boolean) => (
    <div className={['h-16 w-24 rounded-xl border p-2', active ? 'border-zinc-900 dark:border-zinc-100' : 'border-zinc-300/60 dark:border-zinc-700/60'].join(' ')}>
      <div className="h-full w-full rounded-md bg-linear-to-br from-slate-800/80 via-indigo-700/70 to-violet-700/75" />
    </div>
  ),
  render: (card: EidCardState) => (
    <div className="absolute inset-0">
      <MoonlightOverlay card={card} />
      <div
        style={{ fontFamily: card.fontFamily, color: card.textColor }}
        className="relative z-10 flex h-full flex-col px-[68px] pt-[182px] pb-[96px]"
      >
        <div className={cardTitleClass(card.boldText, card.textColor)}>{card.title}</div>
        <div className={cardMessageClass(card.boldText, card.textColor)}>{card.message}</div>
        <div className="mt-auto flex flex-col pt-[28px] pb-14">
          <CardSignature card={card} divider="short" />
        </div>
      </div>
    </div>
  ),
}

export default moonlightTemplate

