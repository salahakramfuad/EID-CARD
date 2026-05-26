import { toCanvas } from 'html-to-image'
import { getOffsetWithinAncestor } from './drawAnimalHeroOnCanvas'

/**
 * Composite each animal &lt;img&gt; using a DOM snapshot (same pixels as on-screen, including CSS filters).
 */
export async function compositeAnimalHeroSnapshots(
  ctx: CanvasRenderingContext2D,
  cardNode: HTMLElement,
): Promise<void> {
  const heroes = cardNode.querySelectorAll<HTMLImageElement>('img[data-animal-hero]')

  for (const img of heroes) {
    if (!img.complete || img.naturalWidth === 0) continue

    const { x, y, width, height } = getOffsetWithinAncestor(img, cardNode)
    if (width < 1 || height < 1) continue

    const snap = await toCanvas(img, {
      pixelRatio: 1,
      cacheBust: false,
      backgroundColor: 'transparent',
      width,
      height,
    })

    ctx.drawImage(snap, x, y, width, height)
  }
}
