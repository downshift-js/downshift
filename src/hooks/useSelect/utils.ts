import PropTypes from 'prop-types'
import {
  commonDropdownPropTypes,
  defaultProps as commonDefaultProps,
} from '../utils'
import {noop} from '../../utils'
import {A11yStatusMessageOptions} from '../../types'
import {GetItemIndexByCharacterKeyOptions} from './types'

export function getItemIndexByCharacterKey<Item>({
  keysSoFar,
  highlightedIndex,
  items,
  itemToString,
  isItemDisabled,
}: GetItemIndexByCharacterKeyOptions<Item>) {
  const lowerCasedKeysSoFar = keysSoFar.toLowerCase()

  for (let index = 0; index < items.length; index++) {
    // if we already have a search query in progress, we also consider the current highlighted item.
    const offsetIndex =
      (index + highlightedIndex + (keysSoFar.length < 2 ? 1 : 0)) % items.length

    const item = items[offsetIndex]

    if (
      item !== undefined &&
      itemToString(item).toLowerCase().startsWith(lowerCasedKeysSoFar) &&
      !isItemDisabled(item, offsetIndex)
    ) {
      return offsetIndex
    }
  }

  return highlightedIndex
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const propTypes = {
  ...commonDropdownPropTypes,
  items: PropTypes.array.isRequired,
  isItemDisabled: PropTypes.func,
  getA11ySelectionMessage: PropTypes.func,
}

/**
 * Default implementation for status message. Only added when menu is open.
 * Will specift if there are results in the list, and if so, how many,
 * and what keys are relevant.
 *
 * @param {Object} param the downshift state and other relevant properties
 * @return {String} the a11y status message
 */
function getA11yStatusMessage<Item>({
  isOpen,
  resultCount,
  previousResultCount,
}: A11yStatusMessageOptions<Item>): string {
  if (!isOpen) {
    return ''
  }

  if (!resultCount) {
    return 'No results are available.'
  }

  if (resultCount !== previousResultCount) {
    return `${resultCount} result${
      resultCount === 1 ? ' is' : 's are'
    } available, use up and down arrow keys to navigate. Press Enter or Space Bar keys to select.`
  }

  return ''
}

export const defaultProps = {
  ...commonDefaultProps,
  getA11yStatusMessage,
  isItemDisabled() {
    return false
  },
}

// eslint-disable-next-line import/no-mutable-exports
export let validatePropTypes = noop as (
  options: unknown,
  caller: Function,
) => void
/* istanbul ignore next */
if (process.env.NODE_ENV !== 'production') {
  validatePropTypes = (options: unknown, caller: Function): void => {
    PropTypes.checkPropTypes(propTypes, options, 'prop', caller.name)
  }
}
