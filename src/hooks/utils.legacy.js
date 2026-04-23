import * as React from 'react'

// istanbul ignore next
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' &&
  typeof window.document !== 'undefined' &&
  typeof window.document.createElement !== 'undefined'
    ? React.useLayoutEffect
    : React.useEffect

function isAcceptedCharacterKey(key) {
  return /^\S{1}$/.test(key)
}

function useScrollIntoView({
  highlightedIndex,
  isOpen,
  itemRefs,
  getItemNodeFromIndex,
  menuElement,
  scrollIntoView: scrollIntoViewProp,
}) {
  // used not to scroll on highlight by mouse.
  const shouldScrollRef = React.useRef(true)
  // Scroll on highlighted item if change comes from keyboard.
  useIsomorphicLayoutEffect(() => {
    if (
      highlightedIndex < 0 ||
      !isOpen ||
      !Object.keys(itemRefs.current).length
    ) {
      return
    }

    if (shouldScrollRef.current === false) {
      shouldScrollRef.current = true
    } else {
      scrollIntoViewProp(getItemNodeFromIndex(highlightedIndex), menuElement)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlightedIndex])

  return shouldScrollRef
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

export {useScrollIntoView, isAcceptedCharacterKey, isDropdownsStateEqual}
