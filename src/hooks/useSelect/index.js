/* eslint-disable max-statements */
import {useRef, useEffect} from 'react'
import {
  getElementIds,
  getItemIndex,
  getPropTypesValidator,
  isAcceptedCharacterKey,
  useControlledReducer,
  getInitialState,
  updateA11yStatus,
  useMouseAndTouchTracker,
} from '../utils'
import {
  callAllEventHandlers,
  handleRefs,
  debounce,
  normalizeArrowKey,
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
    itemToString,
    getA11ySelectionMessage,
    getA11yStatusMessage,
  } = props
  // Initial state depending on controlled props.
  const initialState = getInitialState(props)

  // Reducer init.
  const [
    {isOpen, highlightedIndex, selectedItem, inputValue},
    dispatch,
  ] = useControlledReducer(downshiftSelectReducer, initialState, props)

  // Refs
  const toggleButtonRef = useRef(null)
  const menuRef = useRef(null)
  const isInitialMountRef = useRef(true)
  const shouldScrollRef = useRef(true)
  const shouldBlurRef = useRef(true)
  const clearTimeoutRef = useRef(null)
  const elementIdsRef = useRef(getElementIds(props))
  const previousResultCountRef = useRef()

  // Some utils.
  const getItemNodeFromIndex = index =>
    environment.document.getElementById(elementIdsRef.current.getItemId(index))

  // Effects.
  /* Sets a11y status message on changes in state. */
  useEffect(() => {
    if (isInitialMountRef.current) {
      return
    }

    const previousResultCount = previousResultCountRef.current

    updateA11yStatus(
      () =>
        getA11yStatusMessage({
          isOpen,
          highlightedIndex,
          selectedItem,
          inputValue,
          highlightedItem: items[highlightedIndex],
          resultCount: items.length,
          itemToString,
          previousResultCount,
        }),
      environment.document,
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, highlightedIndex, selectedItem, inputValue])
  /* Sets a11y status message on changes in selectedItem. */
  useEffect(() => {
    if (isInitialMountRef.current) {
      return
    }

    const previousResultCount = previousResultCountRef.current

    updateA11yStatus(
      () =>
        getA11ySelectionMessage({
          isOpen,
          highlightedIndex,
          selectedItem,
          inputValue,
          highlightedItem: items[highlightedIndex],
          resultCount: items.length,
          itemToString,
          previousResultCount,
        }),
      environment.document,
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItem])
  /* Sets cleanup for the keysSoFar after 500ms. */
  useEffect(() => {
    // init the clean function here as we need access to dispatch.
    if (isInitialMountRef.current) {
      clearTimeoutRef.current = debounce(outerDispatch => {
        outerDispatch({
          type: stateChangeTypes.FunctionSetInputValue,
          inputValue: '',
        })
      }, 500)
    }

    if (!inputValue) {
      return
    }
    clearTimeoutRef.current(dispatch)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue])
  /* Controls the focus on the menu or the toggle button. */
  useEffect(() => {
    // Don't focus menu on first render.
    if (isInitialMountRef.current) {
      // Unless it was initialised as open.
      if ((initialIsOpen || defaultIsOpen || isOpen) && menuRef.current) {
        menuRef.current.focus()
      }
      return
    }
    // Focus menu on open.
    if (isOpen) {
      // istanbul ignore else
      if (menuRef.current) {
        menuRef.current.focus()
        return
      }
    }
    // Focus toggleButton on close, but on if was closed with (Shift+)Tab.
    if (environment.document.activeElement === menuRef.current) {
      // istanbul ignore else
      if (toggleButtonRef.current) {
        shouldBlurRef.current = false
        toggleButtonRef.current.focus()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])
  /* Scroll on highlighted item if change comes from keyboard. */
  useEffect(() => {
    if (highlightedIndex < 0 || !isOpen || !items.length) {
      return
    }
    if (shouldScrollRef.current === false) {
      shouldScrollRef.current = true
    } else {
      scrollIntoView(getItemNodeFromIndex(highlightedIndex), menuRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlightedIndex])
  useEffect(() => {
    if (isInitialMountRef.current) {
      return
    }

    previousResultCountRef.current = items.length
  })
  /* Make initial ref false. */
  useEffect(() => {
    isInitialMountRef.current = false
  }, [])
  /* Add mouse/touch events to document. */
  const isMouseDown = useMouseAndTouchTracker(
    isOpen,
    [menuRef, toggleButtonRef],
    environment,
    () => {
      dispatch({
        type: stateChangeTypes.MenuBlur,
      })
    },
  )

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
    // if the blur was a result of selection, we don't trigger this action.
    if (shouldBlurRef.current === false) {
      shouldBlurRef.current = true
      return
    }

    const shouldBlur = !isMouseDown
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
    shouldScrollRef.current = false
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
    id: elementIdsRef.current.labelId,
    htmlFor: elementIdsRef.current.toggleButtonId,
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
    id: elementIdsRef.current.menuId,
    role: 'listbox',
    'aria-labelledby': elementIdsRef.current.labelId,
    tabIndex: -1,
    ...(isOpen &&
      highlightedIndex > -1 && {
        'aria-activedescendant': elementIdsRef.current.getItemId(
          highlightedIndex,
        ),
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
      id: elementIdsRef.current.toggleButtonId,
      'aria-haspopup': 'listbox',
      'aria-expanded': isOpen,
      'aria-labelledby': `${elementIdsRef.current.labelId} ${elementIdsRef.current.toggleButtonId}`,
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
      id: elementIdsRef.current.getItemId(itemIndex),
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
