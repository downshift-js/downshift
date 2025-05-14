import React, {
  useRef,
  useCallback,
  useReducer,
  useEffect,
  useLayoutEffect,
} from 'react'
import PropTypes from 'prop-types'
import {isReactNative} from '../is.macro'
import {
  scrollIntoView,
  getState,
  generateId,
  debounce,
  validateControlledUnchanged,
  noop,
  targetWithinDownshift,
} from '../utils'
import {cleanupStatusDiv, setStatus} from '../set-a11y-status'

const dropdownDefaultStateValues = {
  highlightedIndex: -1,
  isOpen: false,
  selectedItem: null,
  inputValue: '',
}

function callOnChangeProps(action, state, newState) {
  const {props, type} = action
  const changes = {}

  Object.keys(state).forEach(key => {
    invokeOnChangeHandler(key, action, state, newState)

    if (newState[key] !== state[key]) {
      changes[key] = newState[key]
    }
  })

  if (props.onStateChange && Object.keys(changes).length) {
    props.onStateChange({type, ...changes})
  }
}

function invokeOnChangeHandler(key, action, state, newState) {
  const {props, type} = action
  const handler = `on${capitalizeString(key)}Change`
  if (
    props[handler] &&
    newState[key] !== undefined &&
    newState[key] !== state[key]
  ) {
    props[handler]({type, ...newState})
  }
}

/**
 * Default state reducer that returns the changes.
 *
 * @param {Object} s state.
 * @param {Object} a action with changes.
 * @returns {Object} changes.
 */
function stateReducer(s, a) {
  return a.changes
}

/**
 * Debounced call for updating the a11y message.
 */
const updateA11yStatus = debounce((status, document) => {
  setStatus(status, document)
}, 200)

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

        const elementIdsRef = useRef({
          labelId: labelId || `${id}-label`,
          menuId: menuId || `${id}-menu`,
          getItemId: getItemId || (index => `${id}-item-${index}`),
          toggleButtonId: toggleButtonId || `${id}-toggle-button`,
          inputId: inputId || `${id}-input`,
        })

        return elementIdsRef.current
      }
    : function useElementIds({
        id = `downshift-${generateId()}`,
        labelId,
        menuId,
        getItemId,
        toggleButtonId,
        inputId,
      }) {
        const elementIdsRef = useRef({
          labelId: labelId || `${id}-label`,
          menuId: menuId || `${id}-menu`,
          getItemId: getItemId || (index => `${id}-item-${index}`),
          toggleButtonId: toggleButtonId || `${id}-toggle-button`,
          inputId: inputId || `${id}-input`,
        })

        return elementIdsRef.current
      }

function getItemAndIndex(itemProp, indexProp, items, errorMessage) {
  let item, index

  if (itemProp === undefined) {
    if (indexProp === undefined) {
      throw new Error(errorMessage)
    }

    item = items[indexProp]
    index = indexProp
  } else {
    index = indexProp === undefined ? items.indexOf(itemProp) : indexProp
    item = itemProp
  }

  return [item, index]
}

function isAcceptedCharacterKey(key) {
  return /^\S{1}$/.test(key)
}

function capitalizeString(string) {
  return `${string.slice(0, 1).toUpperCase()}${string.slice(1)}`
}

function useLatestRef(val) {
  const ref = useRef(val)
  // technically this is not "concurrent mode safe" because we're manipulating
  // the value during render (so it's not idempotent). However, the places this
  // hook is used is to support memoizing callbacks which will be called
  // *during* render, so we need the latest values *during* render.
  // If not for this, then we'd probably want to use useLayoutEffect instead.
  ref.current = val
  return ref
}

/**
 * Computes the controlled state using a the previous state, props,
 * two reducers, one from downshift and an optional one from the user.
 * Also calls the onChange handlers for state values that have changed.
 *
 * @param {Function} reducer Reducer function from downshift.
 * @param {Object} props The hook props, also passed to createInitialState.
 * @param {Function} createInitialState Function that returns the initial state.
 * @param {Function} isStateEqual Function that checks if a previous state is equal to the next.
 * @returns {Array} An array with the state and an action dispatcher.
 */
function useEnhancedReducer(reducer, props, createInitialState, isStateEqual) {
  const prevStateRef = useRef()
  const actionRef = useRef()
  const enhancedReducer = useCallback(
    (state, action) => {
      actionRef.current = action
      state = getState(state, action.props)

      const changes = reducer(state, action)
      const newState = action.props.stateReducer(state, {...action, changes})

      return newState
    },
    [reducer],
  )
  const [state, dispatch] = useReducer(
    enhancedReducer,
    props,
    createInitialState,
  )
  const propsRef = useLatestRef(props)
  const dispatchWithProps = useCallback(
    action => dispatch({props: propsRef.current, ...action}),
    [propsRef],
  )
  const action = actionRef.current

  useEffect(() => {
    const prevState = getState(prevStateRef.current, action?.props)
    const shouldCallOnChangeProps =
      action && prevStateRef.current && !isStateEqual(prevState, state)

    if (shouldCallOnChangeProps) {
      callOnChangeProps(action, prevState, state)
    }

    prevStateRef.current = state
  }, [state, action, isStateEqual])

  return [state, dispatchWithProps]
}

/**
 * Wraps the useEnhancedReducer and applies the controlled prop values before
 * returning the new state.
 *
 * @param {Function} reducer Reducer function from downshift.
 * @param {Object} props The hook props, also passed to createInitialState.
 * @param {Function} createInitialState Function that returns the initial state.
 * @param {Function} isStateEqual Function that checks if a previous state is equal to the next.
 * @returns {Array} An array with the state and an action dispatcher.
 */
function useControlledReducer(
  reducer,
  props,
  createInitialState,
  isStateEqual,
) {
  const [state, dispatch] = useEnhancedReducer(
    reducer,
    props,
    createInitialState,
    isStateEqual,
  )

  return [getState(state, props), dispatch]
}

const defaultProps = {
  itemToString(item) {
    return item ? String(item) : ''
  },
  itemToKey(item) {
    return item
  },
  stateReducer,
  scrollIntoView,
  environment:
    /* istanbul ignore next (ssr) */
    typeof window === 'undefined' || isReactNative ? undefined : window,
}

function getDefaultValue(
  props,
  propKey,
  defaultStateValues = dropdownDefaultStateValues,
) {
  const defaultValue = props[`default${capitalizeString(propKey)}`]

  if (defaultValue !== undefined) {
    return defaultValue
  }

  return defaultStateValues[propKey]
}

function getInitialValue(
  props,
  propKey,
  defaultStateValues = dropdownDefaultStateValues,
) {
  const value = props[propKey]

  if (value !== undefined) {
    return value
  }

  const initialValue = props[`initial${capitalizeString(propKey)}`]

  if (initialValue !== undefined) {
    return initialValue
  }

  return getDefaultValue(props, propKey, defaultStateValues)
}

function getInitialState(props) {
  const selectedItem = getInitialValue(props, 'selectedItem')
  const isOpen = getInitialValue(props, 'isOpen')
  const highlightedIndex = getInitialHighlightedIndex(props)
  const inputValue = getInitialValue(props, 'inputValue')

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
  downshiftElementsRefs,
) {
  const mouseAndTouchTrackersRef = useRef({
    isMouseDown: false,
    isTouchMove: false,
    isTouchEnd: false,
  })

  useEffect(() => {
    if (isReactNative || !environment) {
      return noop
    }

    const downshiftElements = downshiftElementsRefs.map(ref => ref.current)

    function onMouseDown() {
      mouseAndTouchTrackersRef.current.isTouchEnd = false // reset this one.
      mouseAndTouchTrackersRef.current.isMouseDown = true
    }
    function onMouseUp(event) {
      mouseAndTouchTrackersRef.current.isMouseDown = false

      if (
        !targetWithinDownshift(
          event.target,
          downshiftElements,
          environment,
          true,
          'composedPath' in event && event.composedPath(),
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
          downshiftElements,
          environment,
          false,
          'composedPath' in event && event.composedPath(),
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
  }, [downshiftElementsRefs, environment, handleBlur])

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

/**
 * Adds an a11y aria live status message if getA11yStatusMessage is passed.
 * @param {(options: Object) => string} getA11yStatusMessage The function that builds the status message.
 * @param {Object} options The options to be passed to getA11yStatusMessage if called.
 * @param {Array<unknown>} dependencyArray The dependency array that triggers the status message setter via useEffect.
 * @param {{document: Document}} environment The environment object containing the document.
 */
function useA11yMessageStatus(
  getA11yStatusMessage,
  options,
  dependencyArray,
  environment = {},
) {
  const document = environment.document
  const isInitialMount = useIsInitialMount()

  // Adds an a11y aria live status message if getA11yStatusMessage is passed.
  useEffect(() => {
    if (!getA11yStatusMessage || isInitialMount || isReactNative || !document) {
      return
    }

    const status = getA11yStatusMessage(options)

    updateA11yStatus(status, document)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencyArray)

  // Cleanup the status message container.
  useEffect(() => {
    return () => {
      updateA11yStatus.cancel()
      cleanupStatusDiv(document)
    }
  }, [document])
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
      isOpen: getDefaultValue(props, 'isOpen'),
      highlightedIndex: getDefaultValue(props, 'highlightedIndex'),
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
 * Tracks if it's the first render.
 */
function useIsInitialMount() {
  const isInitialMountRef = React.useRef(true)

  React.useEffect(() => {
    isInitialMountRef.current = false

    return () => {
      isInitialMountRef.current = true
    }
  }, [])

  return isInitialMountRef.current
}

/**
 * Returns the new highlightedIndex based on the defaultHighlightedIndex prop, if it's not disabled.
 *
 * @param {Object} props Props from useCombobox or useSelect.
 * @returns {number} The highlighted index.
 */
function getDefaultHighlightedIndex(props) {
  const highlightedIndex = getDefaultValue(props, 'highlightedIndex')
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
  const highlightedIndex = getInitialValue(props, 'highlightedIndex')

  if (
    highlightedIndex > -1 &&
    props.isItemDisabled(props.items[highlightedIndex], highlightedIndex)
  ) {
    return -1
  }

  return highlightedIndex
}

// Shared between all exports.
const commonPropTypes = {
  environment: PropTypes.shape({
    addEventListener: PropTypes.func.isRequired,
    removeEventListener: PropTypes.func.isRequired,
    document: PropTypes.shape({
      createElement: PropTypes.func.isRequired,
      getElementById: PropTypes.func.isRequired,
      activeElement: PropTypes.any.isRequired,
      body: PropTypes.any.isRequired,
    }).isRequired,
    Node: PropTypes.func.isRequired,
  }),
  itemToString: PropTypes.func,
  itemToKey: PropTypes.func,
  stateReducer: PropTypes.func,
}

// Shared between useSelect, useCombobox, Downshift.
const commonDropdownPropTypes = {
  ...commonPropTypes,
  getA11yStatusMessage: PropTypes.func,
  highlightedIndex: PropTypes.number,
  defaultHighlightedIndex: PropTypes.number,
  initialHighlightedIndex: PropTypes.number,
  isOpen: PropTypes.bool,
  defaultIsOpen: PropTypes.bool,
  initialIsOpen: PropTypes.bool,
  selectedItem: PropTypes.any,
  initialSelectedItem: PropTypes.any,
  defaultSelectedItem: PropTypes.any,
  id: PropTypes.string,
  labelId: PropTypes.string,
  menuId: PropTypes.string,
  getItemId: PropTypes.func,
  toggleButtonId: PropTypes.string,
  onSelectedItemChange: PropTypes.func,
  onHighlightedIndexChange: PropTypes.func,
  onStateChange: PropTypes.func,
  onIsOpenChange: PropTypes.func,
  scrollIntoView: PropTypes.func,
}

export {
  useControlPropsValidator,
  useScrollIntoView,
  updateA11yStatus,
  useGetterPropsCalledChecker,
  useMouseAndTouchTracker,
  getHighlightedIndexOnOpen,
  getInitialState,
  getInitialValue,
  getDefaultValue,
  defaultProps,
  useControlledReducer,
  useEnhancedReducer,
  useLatestRef,
  capitalizeString,
  isAcceptedCharacterKey,
  getItemAndIndex,
  useElementIds,
  getChangesOnSelection,
  isDropdownsStateEqual,
  commonDropdownPropTypes,
  commonPropTypes,
  useIsInitialMount,
  useA11yMessageStatus,
  getDefaultHighlightedIndex,
}
