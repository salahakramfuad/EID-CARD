/** Sum offsetLeft/Top from `element` up to `ancestor` (720×1080 card space). */
export function getOffsetWithinAncestor(
  element: HTMLElement,
  ancestor: HTMLElement,
): { x: number; y: number; width: number; height: number } {
  let x = 0
  let y = 0
  let el: HTMLElement | null = element

  while (el && el !== ancestor) {
    x += el.offsetLeft
    y += el.offsetTop
    el = el.offsetParent as HTMLElement | null
  }

  return {
    x,
    y,
    width: element.offsetWidth,
    height: element.offsetHeight,
  }
}
