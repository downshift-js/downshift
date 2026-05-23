import {Environment} from '../types'

/**
 * Checks if event target is within the downshift elements.
 *
 * @param target Target to check.
 * @param downshiftElements The elements that form downshift (list, toggle button etc).
 * @param environment The window context where downshift renders.
 * @param checkActiveElement Whether to also check activeElement.
 *
 * @returns Whether or not the target is within downshift elements.
 */
export function targetWithinDownshift(
  target: EventTarget | undefined | null,
  downshiftElements: (HTMLElement | undefined | null)[],
  environment: Environment | undefined,
  checkActiveElement = true,
) {
  return (
    !!environment &&
    downshiftElements.some(
      contextNode =>
        contextNode &&
        (isOrContainsNode(contextNode, target, environment) ||
          (checkActiveElement &&
            isOrContainsNode(
              contextNode,
              environment.document.activeElement,
              environment,
            ))),
    )
  )
}

/**
 * @param parent the parent node
 * @param child the child node
 * @param environment The window context where downshift renders.
 * @return Whether the parent is the child or the child is in the parent
 */
function isOrContainsNode(
  parent: HTMLElement,
  child: EventTarget | HTMLElement | null | undefined,
  environment: Environment,
) {
  const result =
    parent === child ||
    (child instanceof environment.Node && parent.contains(child))
  return result
}
