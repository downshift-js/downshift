import {compute} from 'compute-scroll-into-view'

/**
 * Scroll node into view if necessary
 * @param {HTMLElement} node the element that should scroll into view
 * @param {HTMLElement} menuNode the menu element of the component
 */
export function scrollIntoView(
  node: HTMLElement | undefined,
  menuNode: HTMLElement | undefined,
) {
  if (!node) {
    return
  }

  const actions = compute(node, {
    boundary: menuNode,
    block: 'nearest',
    scrollMode: 'if-needed',
  })
  actions.forEach(({el, top, left}) => {
    el.scrollTop = top
    el.scrollLeft = left
  })
}
