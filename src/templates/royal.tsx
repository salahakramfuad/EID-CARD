import { CrescentIcon, SparkleIcon, StarIcon } from './icons'
import { CardSignature } from './signature'
import type { EidCardState, EidTemplate } from './types'

function RoyalOverlay({ card }: { card: EidCardState }) {
  return (
    <div aria-hidden="true" className="absolute inset-0">
      <div className="absolute inset-[30px] rounded-[36px] border-2" style={{ borderColor: card.accentColor, opacity: 0.18 }} />
      <div className="absolute inset-[48px] rounded-[28px] border" style={{ borderColor: card.accentColor, opacity: 0.24 }} />

      <svg viewBox="0 0 720 1080" className="absolute inset-0" style={{ color: card.accentColor, opacity: 0.25 }}>
        <path d="M72 158 C 180 64, 300 64, 360 130 C 420 64, 540 64, 648 158" fill="none" stroke="currentColor" strokeWidth="3" />
        <path d="M100 930 C 188 860, 268 860, 352 920" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <path d="M368 920 C 452 860, 532 860, 620 930" fill="none" stroke="currentColor" strokeWidth="2.5" />
      </svg>

      <div className="absolute left-[72px] top-[166px] h-[24px] w-[24px]" style={{ color: card.accentColor, opacity: 0.9 }}>
        <StarIcon className="h-full w-full" />
      </div>
      <div className="absolute right-[84px] top-[186px] h-[28px] w-[28px]" style={{ color: card.accentColor, opacity: 0.8 }}>
        <CrescentIcon className="h-full w-full" />
      </div>
      <div className="absolute left-[136px] bottom-[206px] h-[18px] w-[18px]" style={{ color: card.accentColor, opacity: 0.8 }}>
        <SparkleIcon className="h-full w-full" />
      </div>
      <div className="absolute right-[170px] bottom-[230px] h-[16px] w-[16px]" style={{ color: card.accentColor, opacity: 0.7 }}>
        <SparkleIcon className="h-full w-full" />
      </div>
    </div>
  )
}

const royalTemplate: EidTemplate = {
  id: 'royal',
  name: 'Royal',
  styleKey: 'royal',
  description: 'Luxury frame with royal ornaments',
  thumbnail: (active: boolean) => (
    <div className={['h-16 w-24 rounded-xl border p-2', active ? 'border-zinc-900 dark:border-zinc-100' : 'border-zinc-300/60 dark:border-zinc-700/60'].join(' ')}>
      <div className="h-full w-full rounded-md bg-linear-to-br from-amber-200/60 via-yellow-100/60 to-orange-200/60" />
    </div>
  ),
  render: (card: EidCardState) => (
    <div className="absolute inset-0">
      <RoyalOverlay card={card} />
      <div style={{ fontFamily: card.fontFamily, color: card.textColor }} className="relative z-10 h-full px-[74px] pt-[174px] pb-[96px] flex flex-col">
        <div className="text-[54px] leading-[0.98] tracking-[-0.9px] font-bold drop-shadow-[0_12px_24px_rgba(0,0,0,0.2)]">{card.title}</div>
        <div className="mt-[20px] text-[30px] leading-[1.3] font-medium whitespace-pre-wrap">{card.message}</div>
        <div className="mt-auto flex flex-col pt-[32px] pb-14">
          <CardSignature card={card} divider="short" />
        </div>
      </div>
    </div>
  ),
}

export default royalTemplate

