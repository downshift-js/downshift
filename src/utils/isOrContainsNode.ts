import {Environment} from 'src/index.types'

/**
 * Checks if the parent node is the child or the child is in the parent.
 * 
 * @param parent The parent node.
 * @param child The node that may be the parent or may be contained by the parent.
 * @param environment The window context where downshift renders.
 *
 * @return Whether the parent is the child or the child is in the parent
 */
export function isOrContainsNode(
  parent: HTMLElement | null,
  child: EventTarget | Element | null,
  environment: Environment,
) {
  return (
    parent === child ||
    (child instanceof environment.Node && parent?.contains(child))
  )
}
