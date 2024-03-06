import PropTypes from 'prop-types'
import {
  commonDropdownPropTypes,
  defaultProps as commonDefaultProps,
} from '../utils'
import {noop} from '../../utils'
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

const propTypes = {
  ...commonDropdownPropTypes,
  items: PropTypes.array.isRequired,
  isItemDisabled: PropTypes.func,
  getA11ySelectionMessage: PropTypes.func,
}

export const defaultProps = {
  ...commonDefaultProps,
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
