import * as React from 'react'
import {
  noop,
  validateControlledUnchanged,
  useIsInitialMount,
  getDefaultValue,
  getInitialValue,
} from '../utils'
import {defaultStateValues} from '../utils.dropdown'

function getInitialState(props) {
  const selectedItem = getInitialValue(
    props,
    'selectedItem',
    defaultStateValues,
  )
  const isOpen = getInitialValue(props, 'isOpen', defaultStateValues)
  const highlightedIndex = getInitialHighlightedIndex(props)
  const inputValue = getInitialValue(props, 'inputValue', defaultStateValues)

  return {
    highlightedIndex:
      highlightedIndex < 0 && selectedItem && isOpen
        ? props.items.findIndex(
            item => props.itemToKey(item) === props.itemToKey(selectedItem),
          )
        : highlightedIndex,
    isOpen,
    selectedItem,
    inputValue,
  }
}

// eslint-disable-next-line import/no-mutable-exports
let useControlPropsValidator = noop
/* istanbul ignore next */
if (process.env.NODE_ENV !== 'production') {
  useControlPropsValidator = ({props, state}) => {
    // used for checking when props are moving from controlled to uncontrolled.
    const prevPropsRef = React.useRef(props)
    const isInitialMount = useIsInitialMount()

    React.useEffect(() => {
      if (isInitialMount) {
        return
      }

      validateControlledUnchanged(state, prevPropsRef.current, props)
      prevPropsRef.current = props
    }, [state, props, isInitialMount])
  }
}

/**
 * Handles selection on Enter / Alt + ArrowUp. Closes the menu and resets the highlighted index, unless there is a highlighted.
 * In that case, selects the item and resets to defaults for open state and highlighted idex.
 * @param {Object} props The useCombobox props.
 * @param {number} highlightedIndex The index from the state.
 * @param {boolean} inputValue Also return the input value for state.
 * @returns The changes for the state.
 */
function getChangesOnSelection(props, highlightedIndex, inputValue = true) {
  const shouldSelect = props.items?.length && highlightedIndex >= 0

  return {
    isOpen: false,
    highlightedIndex: -1,
    ...(shouldSelect && {
      selectedItem: props.items[highlightedIndex],
      isOpen: getDefaultValue(props, 'isOpen', defaultStateValues),
      highlightedIndex: getDefaultValue(
        props,
        'highlightedIndex',
        defaultStateValues,
      ),
      ...(inputValue && {
        inputValue: props.itemToString(props.items[highlightedIndex]),
      }),
    }),
  }
}

/**
 * Check if a state is equal for dropdowns, by comparing isOpen, inputValue, highlightedIndex and selected item.
 * Used by useSelect and useCombobox.
 *
 * @param {Object} prevState
 * @param {Object} newState
 * @returns {boolean} Wheather the states are deeply equal.
 */
function isDropdownsStateEqual(prevState, newState) {
  return (
    prevState.isOpen === newState.isOpen &&
    prevState.inputValue === newState.inputValue &&
    prevState.highlightedIndex === newState.highlightedIndex &&
    prevState.selectedItem === newState.selectedItem
  )
}

/**
 * Returns the new highlightedIndex based on the defaultHighlightedIndex prop, if it's not disabled.
 *
 * @param {Object} props Props from useCombobox or useSelect.
 * @returns {number} The highlighted index.
 */
function getDefaultHighlightedIndex(props) {
  const highlightedIndex = getDefaultValue(
    props,
    'highlightedIndex',
    defaultStateValues,
  )
  if (
    highlightedIndex > -1 &&
    props.isItemDisabled(props.items[highlightedIndex], highlightedIndex)
  ) {
    return -1
  }

  return highlightedIndex
}

/**
 * Returns the new highlightedIndex based on the initialHighlightedIndex prop, if not disabled.
 *
 * @param {Object} props Props from useCombobox or useSelect.
 * @returns {number} The highlighted index.
 */
function getInitialHighlightedIndex(props) {
  const highlightedIndex = getInitialValue(
    props,
    'highlightedIndex',
    defaultStateValues,
  )

  if (
    highlightedIndex > -1 &&
    props.isItemDisabled(props.items[highlightedIndex], highlightedIndex)
  ) {
    return -1
  }

  return highlightedIndex
}

export {
  useControlPropsValidator,
  getChangesOnSelection,
  isDropdownsStateEqual,
  getDefaultHighlightedIndex,
  getInitialState,
}
