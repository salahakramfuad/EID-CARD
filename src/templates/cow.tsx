import { publicAssetUrl } from '../lib/publicAssetUrl'
import { BULL_ART_FILE } from '../lib/animalAssets'
import { renderCowCard } from './cowCardLayout'
import { ISLAMIC_VARIANTS } from './islamicVariants'
import type { EidCardState, EidTemplate } from './types'

const VARIANT = ISLAMIC_VARIANTS.cow
const BULL_THUMB_SRC = publicAssetUrl(BULL_ART_FILE)

const cowTemplate: EidTemplate = {
  id: 'cow',
  name: 'Cow',
  styleKey: 'cow',
  description: 'Eid-ul-Adha with bull line art along the bottom',
  thumbnail: (active) => (
    <div
      className={[
        'flex h-16 w-24 items-end justify-center overflow-hidden rounded-xl border bg-zinc-950 p-0.5',
        active ? 'border-zinc-900 dark:border-zinc-100' : 'border-zinc-300/60 dark:border-zinc-700/60',
      ].join(' ')}
    >
      <img
        src={BULL_THUMB_SRC}
        alt=""
        className="h-[88%] w-full object-contain object-bottom"
        draggable={false}
      />
    </div>
  ),
  render: (card: EidCardState) => renderCowCard(card, VARIANT),
}

export default cowTemplate
