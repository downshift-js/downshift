import * as React from 'react'
import {isReactNative} from '../is.macro'
import {
  validateControlledUnchanged,
  targetWithinDownshift,
} from '../utils.legacy'
import {noop} from '../utils'
import {useIsInitialMount} from './utils'

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

/**
 * Tracks mouse and touch events, such as mouseDown, touchMove and touchEnd.
 *
 * @param {Window} environment The environment to add the event listeners to, for instance window.
 * @param {() => void} handleBlur The function that is called if mouseDown or touchEnd occured outside the downshiftElements.
 * @param {Array<{current: HTMLElement}>} downshiftElementsRefs The refs for the elements that should not trigger a blur action from mouseDown or touchEnd.
 * @returns {{isMouseDown: boolean, isTouchMove: boolean, isTouchEnd: boolean}} The mouse and touch events information, if any of are happening.
 */
function useMouseAndTouchTracker(environment, handleBlur, downshiftRefs) {
  const mouseAndTouchTrackersRef = React.useRef({
    isMouseDown: false,
    isTouchMove: false,
    isTouchEnd: false,
  })

  const getDownshiftElements = React.useCallback(
    () => downshiftRefs.map(ref => ref.current),
    [downshiftRefs],
  )

  React.useEffect(() => {
    if (isReactNative || !environment) {
      return noop
    }

    function onMouseDown() {
      mouseAndTouchTrackersRef.current.isTouchEnd = false // reset this one.
      mouseAndTouchTrackersRef.current.isMouseDown = true
    }
    function onMouseUp(event) {
      mouseAndTouchTrackersRef.current.isMouseDown = false

      if (
        !targetWithinDownshift(
          event.target,
          getDownshiftElements(),
          environment,
        )
      ) {
        handleBlur()
      }
    }
    function onTouchStart() {
      mouseAndTouchTrackersRef.current.isTouchEnd = false
      mouseAndTouchTrackersRef.current.isTouchMove = false
    }
    function onTouchMove() {
      mouseAndTouchTrackersRef.current.isTouchMove = true
    }
    function onTouchEnd(event) {
      mouseAndTouchTrackersRef.current.isTouchEnd = true

      if (
        !mouseAndTouchTrackersRef.current.isTouchMove &&
        !targetWithinDownshift(
          event.target,
          getDownshiftElements(),
          environment,
          false,
        )
      ) {
        handleBlur()
      }
    }

    environment.addEventListener('mousedown', onMouseDown)
    environment.addEventListener('mouseup', onMouseUp)
    environment.addEventListener('touchstart', onTouchStart)
    environment.addEventListener('touchmove', onTouchMove)
    environment.addEventListener('touchend', onTouchEnd)

    return function cleanup() {
      environment.removeEventListener('mousedown', onMouseDown)
      environment.removeEventListener('mouseup', onMouseUp)
      environment.removeEventListener('touchstart', onTouchStart)
      environment.removeEventListener('touchmove', onTouchMove)
      environment.removeEventListener('touchend', onTouchEnd)
    }
  }, [environment, getDownshiftElements, handleBlur])

  return mouseAndTouchTrackersRef.current
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
  useControlPropsValidator,
  useScrollIntoView,
  useGetterPropsCalledChecker,
  useMouseAndTouchTracker,
  isAcceptedCharacterKey,
  isDropdownsStateEqual,
}
