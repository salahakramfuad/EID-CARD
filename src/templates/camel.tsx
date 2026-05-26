import { publicAssetUrl } from '../lib/publicAssetUrl'
import { CAMEL_ART_FILE } from '../lib/animalAssets'
import { renderCamelCard } from './camelCardLayout'
import { ISLAMIC_VARIANTS } from './islamicVariants'
import type { EidCardState, EidTemplate } from './types'

const VARIANT = ISLAMIC_VARIANTS.camel
const CAMEL_THUMB_SRC = publicAssetUrl(CAMEL_ART_FILE)

const camelTemplate: EidTemplate = {
  id: 'camel',
  name: 'Camel',
  styleKey: 'camel',
  description: 'Eid-ul-Adha with caravan art along the bottom',
  thumbnail: (active) => (
    <div
      className={[
        'flex h-16 w-24 items-end justify-center overflow-hidden rounded-xl border p-0.5',
        active ? 'border-zinc-900 dark:border-zinc-100' : 'border-zinc-300/60 dark:border-zinc-700/60',
      ].join(' ')}
    >
      <img
        src={CAMEL_THUMB_SRC}
        alt=""
        className="h-[70%] w-full object-contain object-bottom opacity-90"
        draggable={false}
      />
    </div>
  ),
  render: (card: EidCardState) => renderCamelCard(card, VARIANT),
}

export default camelTemplate
