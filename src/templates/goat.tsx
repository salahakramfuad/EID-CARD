import { publicAssetUrl } from '../lib/publicAssetUrl'
import { GOAT_ART_FILE } from '../lib/animalAssets'
import { renderGoatCard } from './goatCardLayout'
import { ISLAMIC_VARIANTS } from './islamicVariants'
import type { EidCardState, EidTemplate } from './types'

const VARIANT = ISLAMIC_VARIANTS.goat
const GOAT_THUMB_SRC = publicAssetUrl(GOAT_ART_FILE)

const goatTemplate: EidTemplate = {
  id: 'goat',
  name: 'Goat',
  styleKey: 'goat',
  description: 'Eid-ul-Adha with goat portrait beside your message',
  thumbnail: (active) => (
    <div
      className={[
        'flex h-16 w-24 items-center justify-center overflow-hidden rounded-xl border p-0.5',
        active ? 'border-zinc-900 dark:border-zinc-100' : 'border-zinc-300/60 dark:border-zinc-700/60',
      ].join(' ')}
    >
      <img
        src={GOAT_THUMB_SRC}
        alt=""
        className="h-full w-full object-contain object-center"
        draggable={false}
      />
    </div>
  ),
  render: (card: EidCardState) => renderGoatCard(card, VARIANT),
}

export default goatTemplate
