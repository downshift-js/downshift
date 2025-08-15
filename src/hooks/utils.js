import React, {useRef, useCallback, useEffect, useLayoutEffect} from 'react'
import {isReactNative} from '../is.macro'
import {validateControlledUnchanged, targetWithinDownshift} from '../utils'
import {generateId, noop} from '../utils-ts'
import {useIsInitialMount, getDefaultValue, getInitialValue} from './utils-ts'
import {dropdownDefaultStateValues} from './utils.dropdown'

// istanbul ignore next
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' &&
  typeof window.document !== 'undefined' &&
  typeof window.document.createElement !== 'undefined'
    ? useLayoutEffect
    : useEffect

// istanbul ignore next
const useElementIds =
  'useId' in React // Avoid conditional useId call
    ? function useElementIds({
        id,
        labelId,
        menuId,
        getItemId,
        toggleButtonId,
        inputId,
      }) {
        // Avoid conditional useId call
        const reactId = `downshift-${React.useId()}`
        if (!id) {
          id = reactId
        }

        const elementIds = useMemo(
          () => ({
            labelId: labelId || `${id}-label`,
            menuId: menuId || `${id}-menu`,
            getItemId: getItemId || (index => `${id}-item-${index}`),
            toggleButtonId: toggleButtonId || `${id}-toggle-button`,
            inputId: inputId || `${id}-input`,
          }),
          [getItemId, id, inputId, labelId, menuId, toggleButtonId],
        )

        return elementIds
      }
    : function useElementIds({
        id = `downshift-${generateId()}`,
        labelId,
        menuId,
        getItemId,
        toggleButtonId,
        inputId,
      }) {
        const elementIds = useMemo(
          () => ({
            labelId: labelId || `${id}-label`,
            menuId: menuId || `${id}-menu`,
            getItemId: getItemId || (index => `${id}-item-${index}`),
            toggleButtonId: toggleButtonId || `${id}-toggle-button`,
            inputId: inputId || `${id}-input`,
          }),
          [getItemId, id, inputId, labelId, menuId, toggleButtonId],
        )

        return elementIds
      }

function isAcceptedCharacterKey(key) {
  return /^\S{1}$/.test(key)
}

function getInitialState(props) {
  const selectedItem = getInitialValue(
    props,
    'selectedItem',
    dropdownDefaultStateValues,
  )
  const isOpen = getInitialValue(props, 'isOpen', dropdownDefaultStateValues)
  const highlightedIndex = getInitialHighlightedIndex(props)
  const inputValue = getInitialValue(
    props,
    'inputValue',
    dropdownDefaultStateValues,
  )

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

function getHighlightedIndexOnOpen(props, state, offset) {
  const {
    items,
    initialHighlightedIndex,
    defaultHighlightedIndex,
    isItemDisabled,
    itemToKey,
  } = props
  const {selectedItem, highlightedIndex} = state

  if (items.length === 0) {
    return -1
  }

  // initialHighlightedIndex will give value to highlightedIndex on initial state only.
  if (
    initialHighlightedIndex !== undefined &&
    highlightedIndex === initialHighlightedIndex &&
    !isItemDisabled(items[initialHighlightedIndex], initialHighlightedIndex)
  ) {
    return initialHighlightedIndex
  }

  if (
    defaultHighlightedIndex !== undefined &&
    !isItemDisabled(items[defaultHighlightedIndex], defaultHighlightedIndex)
  ) {
    return defaultHighlightedIndex
  }

  if (selectedItem) {
    return items.findIndex(item => itemToKey(selectedItem) === itemToKey(item))
  }

  if (
    offset < 0 &&
    !isItemDisabled(items[items.length - 1], items.length - 1)
  ) {
    return items.length - 1
  }

  if (offset > 0 && !isItemDisabled(items[0], 0)) {
    return 0
  }

  return -1
}
/**
 * Tracks mouse and touch events, such as mouseDown, touchMove and touchEnd.
 *
 * @param {Window} environment The environment to add the event listeners to, for instance window.
 * @param {() => void} handleBlur The function that is called if mouseDown or touchEnd occured outside the downshiftElements.
 * @param {Array<{current: HTMLElement}>} downshiftElementsRefs The refs for the elements that should not trigger a blur action from mouseDown or touchEnd.
 * @returns {{isMouseDown: boolean, isTouchMove: boolean, isTouchEnd: boolean}} The mouse and touch events information, if any of are happening.
 */
function useMouseAndTouchTracker(
  environment,
  handleBlur,
  downshiftRefs,
) {
  const mouseAndTouchTrackersRef = useRef({
    isMouseDown: false,
    isTouchMove: false,
    isTouchEnd: false,
  })

const getDownshiftElements = useCallback(
  () => downshiftRefs.map(ref => ref.current),
  [downshiftRefs],
);

  useEffect(() => {
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
        !targetWithinDownshift(event.target, getDownshiftElements(), environment)
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
    const getterPropsCalledRef = useRef(
      propKeys.reduce((acc, propKey) => {
        acc[propKey] = {}

        return acc
      }, {}),
    )

    useEffect(() => {
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

    const setGetterPropCallInfo = useCallback(
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
  const shouldScrollRef = useRef(true)
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
    const prevPropsRef = useRef(props)
    const isInitialMount = useIsInitialMount()

    useEffect(() => {
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
      isOpen: getDefaultValue(props, 'isOpen', dropdownDefaultStateValues),
      highlightedIndex: getDefaultValue(
        props,
        'highlightedIndex',
        dropdownDefaultStateValues,
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
    dropdownDefaultStateValues,
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
    dropdownDefaultStateValues,
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
  useScrollIntoView,
  useGetterPropsCalledChecker,
  useMouseAndTouchTracker,
  getHighlightedIndexOnOpen,
  isAcceptedCharacterKey,
  useElementIds,
  getChangesOnSelection,
  isDropdownsStateEqual,
  getDefaultHighlightedIndex,
  getInitialState,
}
