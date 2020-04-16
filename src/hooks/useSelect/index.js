/* eslint-disable max-statements */
import {useRef, useEffect} from 'react'
import {
  getElementIds,
  getItemIndex,
  getPropTypesValidator,
  isAcceptedCharacterKey,
  useEnhancedReducer,
  getInitialState,
  useA11yMessageEffect,
} from '../utils'
import {
  callAllEventHandlers,
  handleRefs,
  debounce,
  normalizeArrowKey,
  targetWithinDownshift,
} from '../../utils'
import downshiftSelectReducer from './reducer'
import {propTypes, defaultProps} from './utils'
import * as stateChangeTypes from './stateChangeTypes'

const validatePropTypes =
  process.env.NODE_ENV === 'production'
    ? /* istanbul ignore next */ null
    : getPropTypesValidator(useSelect, propTypes)

useSelect.stateChangeTypes = stateChangeTypes

function useSelect(userProps = {}) {
  /* istanbul ignore else */
  if (process.env.NODE_ENV !== 'production') {
    validatePropTypes(userProps)
  }
  // Props defaults and destructuring.
  const props = {
    ...defaultProps,
    ...userProps,
  }
  const {
    items,
    scrollIntoView,
    environment,
    initialIsOpen,
    defaultIsOpen,
  } = props
  // Initial state depending on controlled props.
  const initialState = getInitialState(props)

  // Reducer init.
  const [state, dispatch] = useEnhancedReducer(
    downshiftSelectReducer,
    initialState,
    props,
  )
  const {isOpen, highlightedIndex, selectedItem, inputValue} = state

  /* Refs */
  const toggleButtonRef = useRef(null)
  const menuRef = useRef(null)
  const isInitialMount = useRef(true)
  const shouldScroll = useRef(true)
  const clearTimeout = useRef(null)
  const mouseAndTouchTrackers = useRef({
    isMouseDown: false,
    isTouchMove: false,
  })
  const elementIds = useRef(getElementIds(props))
  const previousResultCountRef = useRef()

  // Some utils.
  const getItemNodeFromIndex = index =>
    environment.document.getElementById(elementIds.current.getItemId(index))

  // Effects.
  /* Sets a11y status message on changes in isOpen. */
  useA11yMessageEffect(
    isInitialMount.current,
    state,
    props,
    props.getA11yStatusMessage,
    [isOpen, highlightedIndex, selectedItem, inputValue],
    {previousResultCount: previousResultCountRef.current},
  )
  /* Sets a11y status message on changes in selectedItem. */
  useA11yMessageEffect(
    isInitialMount.current,
    state,
    props,
    props.getA11ySelectionMessage,
    [selectedItem],
    {previousResultCount: previousResultCountRef.current},
  )
  /* Sets cleanup for the keysSoFar after 500ms. */
  useEffect(() => {
    // init the clean function here as we need access to dispatch.
    if (isInitialMount.current) {
      clearTimeout.current = debounce(outerDispatch => {
        outerDispatch({
          type: stateChangeTypes.FunctionSetInputValue,
          inputValue: '',
        })
      }, 500)
    }

    if (!inputValue) {
      return
    }
    clearTimeout.current(dispatch)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue])
  /* Controls the focus on the menu or the toggle button. */
  useEffect(() => {
    // Don't focus menu on first render.
    if (isInitialMount.current) {
      // Unless it was initialised as open.
      if ((initialIsOpen || defaultIsOpen || isOpen) && menuRef.current) {
        menuRef.current.focus()
      }
      return
    }
    // Focus menu on open.
    // istanbul ignore next
    if (isOpen && menuRef.current) {
      menuRef.current.focus()
      // Focus toggleButton on close.
    } else if (
      environment.document.activeElement === menuRef.current &&
      toggleButtonRef.current
    ) {
      toggleButtonRef.current.focus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])
  /* Scroll on highlighted item if change comes from keyboard. */
  useEffect(() => {
    if (highlightedIndex < 0 || !isOpen || !items.length) {
      return
    }
    if (shouldScroll.current === false) {
      shouldScroll.current = true
    } else {
      scrollIntoView(getItemNodeFromIndex(highlightedIndex), menuRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlightedIndex])
  // Update previous result count.
  useEffect(() => {
    if (!isInitialMount.current) {
      previousResultCountRef.current = items.length
    }
  })
  /* Make initial ref false. */
  useEffect(() => {
    isInitialMount.current = false
  }, [])
  /* Add mouse/touch events to document. */
  useEffect(() => {
    // The same strategy for checking if a click occurred inside or outside downsift
    // as in downshift.js.
    const onMouseDown = () => {
      mouseAndTouchTrackers.current.isMouseDown = true
    }
    const onMouseUp = event => {
      mouseAndTouchTrackers.current.isMouseDown = false
      if (
        isOpen &&
        !targetWithinDownshift(
          event.target,
          [toggleButtonRef.current, menuRef.current],
          environment.document,
        )
      ) {
        dispatch({
          type: stateChangeTypes.MenuBlur,
        })
      }
    }
    const onTouchStart = () => {
      mouseAndTouchTrackers.current.isTouchMove = false
    }
    const onTouchMove = () => {
      mouseAndTouchTrackers.current.isTouchMove = true
    }
    const onTouchEnd = event => {
      if (
        isOpen &&
        !mouseAndTouchTrackers.current.isTouchMove &&
        !targetWithinDownshift(
          event.target,
          [toggleButtonRef.current, menuRef.current],
          environment.document,
          false,
        )
      ) {
        dispatch({
          type: stateChangeTypes.MenuBlur,
        })
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
  })

  // Event handler functions.
  const toggleButtonKeyDownHandlers = {
    ArrowDown(event) {
      event.preventDefault()

      dispatch({
        type: stateChangeTypes.ToggleButtonKeyDownArrowDown,
        getItemNodeFromIndex,
        shiftKey: event.shiftKey,
      })
    },
    ArrowUp(event) {
      event.preventDefault()

      dispatch({
        type: stateChangeTypes.ToggleButtonKeyDownArrowUp,
        getItemNodeFromIndex,
        shiftKey: event.shiftKey,
      })
    },
  }
  const menuKeyDownHandlers = {
    ArrowDown(event) {
      event.preventDefault()

      dispatch({
        type: stateChangeTypes.MenuKeyDownArrowDown,
        getItemNodeFromIndex,
        shiftKey: event.shiftKey,
      })
    },
    ArrowUp(event) {
      event.preventDefault()

      dispatch({
        type: stateChangeTypes.MenuKeyDownArrowUp,
        getItemNodeFromIndex,
        shiftKey: event.shiftKey,
      })
    },
    Home(event) {
      event.preventDefault()

      dispatch({
        type: stateChangeTypes.MenuKeyDownHome,
        getItemNodeFromIndex,
      })
    },
    End(event) {
      event.preventDefault()

      dispatch({
        type: stateChangeTypes.MenuKeyDownEnd,
        getItemNodeFromIndex,
      })
    },
    Escape() {
      dispatch({
        type: stateChangeTypes.MenuKeyDownEscape,
      })
    },
    Enter(event) {
      event.preventDefault()

      dispatch({
        type: stateChangeTypes.MenuKeyDownEnter,
      })
    },
    ' '(event) {
      event.preventDefault()

      dispatch({
        type: stateChangeTypes.MenuKeyDownSpaceButton,
      })
    },
  }

  // Event handlers.
  const menuHandleKeyDown = event => {
    const key = normalizeArrowKey(event)
    if (key && menuKeyDownHandlers[key]) {
      menuKeyDownHandlers[key](event)
    } else if (isAcceptedCharacterKey(key)) {
      dispatch({
        type: stateChangeTypes.MenuKeyDownCharacter,
        key,
        getItemNodeFromIndex,
      })
    }
  }
  const menuHandleBlur = () => {
    const shouldBlur = !mouseAndTouchTrackers.current.isMouseDown
    /* istanbul ignore else */
    if (shouldBlur) {
      dispatch({type: stateChangeTypes.MenuBlur})
    }
  }
  const menuHandleMouseLeave = () => {
    dispatch({
      type: stateChangeTypes.MenuMouseLeave,
    })
  }
  const toggleButtonHandleClick = () => {
    dispatch({
      type: stateChangeTypes.ToggleButtonClick,
    })
  }
  const toggleButtonHandleKeyDown = event => {
    const key = normalizeArrowKey(event)
    if (key && toggleButtonKeyDownHandlers[key]) {
      toggleButtonKeyDownHandlers[key](event)
    } else if (isAcceptedCharacterKey(key)) {
      dispatch({
        type: stateChangeTypes.ToggleButtonKeyDownCharacter,
        key,
        getItemNodeFromIndex,
      })
    }
  }
  const itemHandleMouseMove = index => {
    if (index === highlightedIndex) {
      return
    }
    shouldScroll.current = false
    dispatch({
      type: stateChangeTypes.ItemMouseMove,
      index,
    })
  }
  const itemHandleClick = index => {
    dispatch({
      type: stateChangeTypes.ItemClick,
      index,
    })
  }

  // Action functions.
  const toggleMenu = () => {
    dispatch({
      type: stateChangeTypes.FunctionToggleMenu,
    })
  }
  const closeMenu = () => {
    dispatch({
      type: stateChangeTypes.FunctionCloseMenu,
    })
  }
  const openMenu = () => {
    dispatch({
      type: stateChangeTypes.FunctionOpenMenu,
    })
  }
  const setHighlightedIndex = newHighlightedIndex => {
    dispatch({
      type: stateChangeTypes.FunctionSetHighlightedIndex,
      highlightedIndex: newHighlightedIndex,
    })
  }
  const selectItem = newSelectedItem => {
    dispatch({
      type: stateChangeTypes.FunctionSelectItem,
      selectedItem: newSelectedItem,
    })
  }
  const reset = () => {
    dispatch({
      type: stateChangeTypes.FunctionReset,
    })
  }
  const setInputValue = newInputValue => {
    dispatch({
      type: stateChangeTypes.FunctionSetInputValue,
      inputValue: newInputValue,
    })
  }
  // Getter functions.
  const getLabelProps = labelProps => ({
    id: elementIds.current.labelId,
    htmlFor: elementIds.current.toggleButtonId,
    ...labelProps,
  })
  const getMenuProps = ({
    onMouseLeave,
    refKey = 'ref',
    onKeyDown,
    onBlur,
    ref,
    ...rest
  } = {}) => ({
    [refKey]: handleRefs(ref, menuNode => {
      menuRef.current = menuNode
    }),
    id: elementIds.current.menuId,
    role: 'listbox',
    'aria-labelledby': elementIds.current.labelId,
    tabIndex: -1,
    ...(isOpen &&
      highlightedIndex > -1 && {
        'aria-activedescendant': elementIds.current.getItemId(highlightedIndex),
      }),
    onMouseLeave: callAllEventHandlers(onMouseLeave, menuHandleMouseLeave),
    onKeyDown: callAllEventHandlers(onKeyDown, menuHandleKeyDown),
    onBlur: callAllEventHandlers(onBlur, menuHandleBlur),
    ...rest,
  })
  const getToggleButtonProps = ({
    onClick,
    onKeyDown,
    refKey = 'ref',
    ref,
    ...rest
  } = {}) => {
    const toggleProps = {
      [refKey]: handleRefs(ref, toggleButtonNode => {
        toggleButtonRef.current = toggleButtonNode
      }),
      id: elementIds.current.toggleButtonId,
      'aria-haspopup': 'listbox',
      'aria-expanded': isOpen,
      'aria-labelledby': `${elementIds.current.labelId} ${elementIds.current.toggleButtonId}`,
      ...rest,
    }

    if (!rest.disabled) {
      toggleProps.onClick = callAllEventHandlers(
        onClick,
        toggleButtonHandleClick,
      )
      toggleProps.onKeyDown = callAllEventHandlers(
        onKeyDown,
        toggleButtonHandleKeyDown,
      )
    }

    return toggleProps
  }
  const getItemProps = ({item, index, onMouseMove, onClick, ...rest} = {}) => {
    const itemIndex = getItemIndex(index, item, items)
    if (itemIndex < 0) {
      throw new Error('Pass either item or item index in getItemProps!')
    }
    const itemProps = {
      role: 'option',
      'aria-selected': `${itemIndex === highlightedIndex}`,
      id: elementIds.current.getItemId(itemIndex),
      ...rest,
    }

    if (!rest.disabled) {
      itemProps.onMouseMove = callAllEventHandlers(onMouseMove, () =>
        itemHandleMouseMove(itemIndex),
      )
      itemProps.onClick = callAllEventHandlers(onClick, () =>
        itemHandleClick(itemIndex),
      )
    }

    return itemProps
  }

  return {
    // prop getters.
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getItemProps,
    // actions.
    toggleMenu,
    openMenu,
    closeMenu,
    setHighlightedIndex,
    selectItem,
    reset,
    setInputValue,
    // state.
    highlightedIndex,
    isOpen,
    selectedItem,
    inputValue,
  }
}

export default useSelect
