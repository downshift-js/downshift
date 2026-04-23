import * as React from 'react'
import {noop} from '../utils'

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

/* istanbul ignore next */
// eslint-disable-next-line import/no-mutable-exports
let useGetterPropsCalledChecker = () => noop
/**
 * Custom hook that checks if getter props are called correctly.
 *
 * @param  {...any} propKeys Getter prop names to be handled.
 * @returns {Function} Setter function called inside getter props to set call information.
 */
/* istanbul ignore next */
if (process.env.NODE_ENV !== 'production') {
  useGetterPropsCalledChecker = (...propKeys) => {
    const getterPropsCalledRef = React.useRef(
      propKeys.reduce((acc, propKey) => {
        acc[propKey] = {}

        return acc
      }, {}),
    )

    React.useEffect(() => {
      Object.keys(getterPropsCalledRef.current).forEach(propKey => {
        const propCallInfo = getterPropsCalledRef.current[propKey]

        if (!Object.keys(propCallInfo).length) {
          // eslint-disable-next-line no-console
          console.error(
            `downshift: You forgot to call the ${propKey} getter function on your component / element.`,
          )
          return
        }

        const {suppressRefError, refKey, elementRef} = propCallInfo

        if (suppressRefError) {
          return
        }

        if (!elementRef?.current) {
          // eslint-disable-next-line no-console
          console.error(
            `downshift: The ref prop "${refKey}" from ${propKey} was not applied correctly on your element.`,
          )
        }
      })
    }, [])

    const setGetterPropCallInfo = React.useCallback(
      (propKey, suppressRefError, refKey, elementRef) => {
        getterPropsCalledRef.current[propKey] = {
          suppressRefError,
          refKey,
          elementRef,
        }
      },
      [],
    )

    return setGetterPropCallInfo
  }
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

export {
  useScrollIntoView,
  useGetterPropsCalledChecker,
  isAcceptedCharacterKey,
  isDropdownsStateEqual,
}
