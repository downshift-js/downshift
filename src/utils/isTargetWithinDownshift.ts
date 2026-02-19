import {Environment} from 'src/index.types'
import {isOrContainsNode} from './isOrContainsNode'

/**
 * Checks if event target is within the downshift elements.
 *
 * @param target Target to check.
 * @param downshiftElements The elements that form downshift (list, toggle button etc).
 * @param environment The environment context where downshift renders.
 * @param checkActiveElement Whether to also check activeElement.
 *
 * @returns Whether or not the target is within downshift elements.
 */
export function isTargetWithinDownshift(
  target: EventTarget | null,
  downshiftElements: Array<HTMLElement | null>,
  environment: Environment | undefined,
  checkActiveElement = true,
) {
  if (!environment || !target) {
    return false
  }

  return downshiftElements.some(contextNode => {
    if (!contextNode) {
      return false
    }

    if (isOrContainsNode(contextNode, target, environment)) {
      return true
    }

    return (
      checkActiveElement &&
      isOrContainsNode(
        contextNode,
        environment.document.activeElement,
        environment,
      )
    )
  })
}
