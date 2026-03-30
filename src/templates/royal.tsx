import { cardMessageClass, cardTitleClass } from '../lib/cardTypography'
import { CrescentIcon, InterlacedSquareIcon, KhatamStarIcon, StarIcon } from './icons'
import { CardSignature } from './signature'
import type { EidCardState, EidTemplate } from './types'

function RoyalOverlay({ card }: { card: EidCardState }) {
  return (
    <div aria-hidden="true" className="absolute inset-0">
      <div className="absolute inset-[28px] rounded-[34px] border" style={{ borderColor: card.accentColor, opacity: 0.14 }} />
      <div className="absolute inset-[46px] rounded-[26px] border" style={{ borderColor: card.accentColor, opacity: 0.18 }} />

      <svg viewBox="0 0 720 1080" className="absolute inset-0" style={{ color: card.accentColor, opacity: 0.2 }}>
        <defs>
          <linearGradient id="royalDome" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.15" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.55" />
          </linearGradient>
        </defs>
        <path d="M72 158 C 180 64, 300 64, 360 130 C 420 64, 540 64, 648 158" fill="none" stroke="url(#royalDome)" strokeWidth="2.25" />
        <path d="M100 930 C 188 860, 268 860, 352 920" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M368 920 C 452 860, 532 860, 620 930" fill="none" stroke="currentColor" strokeWidth="2" />
        <path
          fill="currentColor"
          fillRule="evenodd"
          opacity="0.34"
          d="M360 118 L372 130 360 142 348 130ZM360 124 L366 130 360 136 354 130Z"
        />
        <path fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.4" d="M360 148 C 330 168 330 208 360 228 C 390 208 390 168 360 148" />
      </svg>

      <div className="absolute left-[72px] top-[166px] h-[24px] w-[24px]" style={{ color: card.accentColor, opacity: 0.72 }}>
        <StarIcon className="h-full w-full" />
      </div>
      <div className="absolute right-[84px] top-[186px] h-[28px] w-[28px]" style={{ color: card.accentColor, opacity: 0.62 }}>
        <CrescentIcon className="h-full w-full" />
      </div>
      <div className="absolute left-[136px] bottom-[206px] h-[20px] w-[20px]" style={{ color: card.accentColor, opacity: 0.55 }}>
        <KhatamStarIcon className="h-full w-full" />
      </div>
      <div className="absolute right-[170px] bottom-[230px] h-[18px] w-[18px]" style={{ color: card.accentColor, opacity: 0.52 }}>
        <InterlacedSquareIcon className="h-full w-full" />
      </div>
      <div className="absolute left-[108px] top-[280px] h-[22px] w-[22px]" style={{ color: card.accentColor, opacity: 0.45 }}>
        <KhatamStarIcon className="h-full w-full" />
      </div>
      <div className="absolute right-[96px] bottom-[340px] h-[22px] w-[22px]" style={{ color: card.accentColor, opacity: 0.42 }}>
        <KhatamStarIcon className="h-full w-full" />
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
  ),
}

export default royalTemplate

