/* eslint-disable max-statements */
import {useRef, useEffect} from 'react'
import {
  getElementIds,
  getItemIndex,
  getPropTypesValidator,
  isAcceptedCharacterKey,
  useEnhancedReducer,
  useId,
  focusLandsOnElement,
} from '../utils'
import setStatus from '../../set-a11y-status'
import {
  callAllEventHandlers,
  handleRefs,
  debounce,
  normalizeArrowKey,
} from '../../utils'
import downshiftSelectReducer from './reducer'
import {getInitialState, propTypes, defaultProps} from './utils'
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
    itemToString,
    getA11yStatusMessage,
    getA11ySelectionMessage,
    initialIsOpen,
    defaultIsOpen,
    scrollIntoView,
    environment,
  } = props
  // Initial state depending on controlled props.
  const initialState = getInitialState(props)

  // Reducer init.
  const [
    {isOpen, highlightedIndex, selectedItem, keysSoFar},
    dispatchWithoutProps,
  ] = useEnhancedReducer(downshiftSelectReducer, initialState, props)
  const dispatch = action => dispatchWithoutProps({props, ...action})

  // IDs generation.
  const {labelId, getItemId, menuId, toggleButtonId} = getElementIds(
    useId,
    props,
  )

  /* Refs */
  const toggleButtonRef = useRef(null)
  const menuRef = useRef(null)
  const itemRefs = useRef()
  itemRefs.current = []
  const isInitialMount = useRef(true)
  const shouldScroll = useRef(true)
  const clearTimeout = useRef(null)

  /* Effects */
  /* Sets a11y status message on changes in isOpen. */
  useEffect(() => {
    if (isInitialMount.current) {
      return
    }
    setStatus(
      getA11yStatusMessage({
        isOpen,
        items,
        selectedItem,
        itemToString,
      }),
      environment.document,
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])
  /* Sets a11y status message on changes in selectedItem. */
  useEffect(() => {
    if (isInitialMount.current) {
      return
    }
    setStatus(
      getA11ySelectionMessage({
        isOpen,
        items,
        selectedItem,
        itemToString,
      }),
      environment.document,
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItem])
  /* Sets cleanup for the keysSoFar after 500ms. */
  useEffect(() => {
    // init the clean function here as we need access to dispatch.
    if (isInitialMount.current) {
      clearTimeout.current = debounce(outerDispatch => {
        outerDispatch({
          type: stateChangeTypes.FunctionClearKeysSoFar,
        })
      }, 500)
    }
    if (!keysSoFar) {
      return
    }
    clearTimeout.current(dispatch)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keysSoFar])
  /* Controls the focus on the menu or the toggle button. */
  useEffect(() => {
    // Don't focus menu on first render.
    if (isInitialMount.current) {
      // Unless it was initialised as open.
      if (initialIsOpen || defaultIsOpen || isOpen) {
        menuRef.current.focus()
      }
      return
    }
    // Focus menu on open.
    // istanbul ignore next
    if (isOpen) {
      menuRef.current.focus()
      // Focus toggleButton on close.
    } else if (environment.document.activeElement === menuRef.current) {
      toggleButtonRef.current.focus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])
  /* Scroll on highlighted item if change comes from keyboard. */
  useEffect(() => {
    if (highlightedIndex < 0 || !isOpen || !itemRefs.current.length) {
      return
    }
    if (shouldScroll.current === false) {
      shouldScroll.current = true
    } else {
      scrollIntoView(itemRefs.current[highlightedIndex], menuRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlightedIndex])
  /* Make initial ref false. */
  useEffect(() => {
    isInitialMount.current = false
  }, [])

  const getItemNodeFromIndex = index => itemRefs.current[index]

  /* Event handler functions */
  const menuKeyDownHandlers = {
    ArrowDown(event) {
      event.preventDefault()
      dispatch({
        type: stateChangeTypes.MenuKeyDownArrowDown,
        shiftKey: event.shiftKey,
        getItemNodeFromIndex,
      })
    },
    ArrowUp(event) {
      event.preventDefault()
      dispatch({
        type: stateChangeTypes.MenuKeyDownArrowUp,
        shiftKey: event.shiftKey,
        getItemNodeFromIndex,
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
    Tab(event) {
      // The exception that calls MenuBlur.
      // istanbul ignore next
      if (event.shiftKey) {
        dispatch({
          type: stateChangeTypes.MenuBlur,
        })
      }
    },
  }
  const toggleButtonKeyDownHandlers = {
    ArrowDown(event) {
      event.preventDefault()
      dispatch({
        type: stateChangeTypes.ToggleButtonKeyDownArrowDown,
        getItemNodeFromIndex,
      })
    },
    ArrowUp(event) {
      event.preventDefault()
      dispatch({
        type: stateChangeTypes.ToggleButtonKeyDownArrowUp,
        getItemNodeFromIndex,
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
  // Focus going back to the toggleButton is something we control (Escape, Enter, Click).
  // We are toggleing special actions for these cases in reducer, not MenuBlur.
  // Since Shift-Tab also lands focus on toggleButton, we will handle it as exception and call MenuBlur.
  const menuHandleBlur = event => {
    if (!focusLandsOnElement(event, toggleButtonRef.current)) {
      dispatch({
        type: stateChangeTypes.MenuBlur,
      })
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

  // returns
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
  const getLabelProps = labelProps => ({
    id: labelId,
    htmlFor: toggleButtonId,
    ...labelProps,
  })
  const getMenuProps = ({
    onKeyDown,
    onBlur,
    onMouseLeave,
    refKey = 'ref',
    ref,
    ...rest
  } = {}) => ({
    [refKey]: handleRefs(ref, menuNode => {
      menuRef.current = menuNode
    }),
    id: menuId,
    role: 'listbox',
    'aria-labelledby': labelId,
    tabIndex: -1,
    ...(highlightedIndex > -1 && {
      'aria-activedescendant': getItemId(highlightedIndex),
    }),
    onKeyDown: callAllEventHandlers(onKeyDown, menuHandleKeyDown),
    onBlur: callAllEventHandlers(onBlur, menuHandleBlur),
    onMouseLeave: callAllEventHandlers(onMouseLeave, menuHandleMouseLeave),
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
      id: toggleButtonId,
      'aria-haspopup': 'listbox',
      'aria-expanded': isOpen,
      'aria-labelledby': `${labelId} ${toggleButtonId}`,
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
  const getItemProps = ({
    item,
    index,
    refKey = 'ref',
    ref,
    onMouseMove,
    onClick,
    ...rest
  } = {}) => {
    const itemIndex = getItemIndex(index, item, items)
    if (itemIndex < 0) {
      throw new Error('Pass either item or item index in getItemProps!')
    }
    const itemProps = {
      [refKey]: handleRefs(ref, itemNode => {
        if (itemNode) {
          itemRefs.current.push(itemNode)
        }
      }),
      role: 'option',
      'aria-selected': `${itemIndex === highlightedIndex}`,
      id: getItemId(itemIndex),
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
    // state.
    highlightedIndex,
    isOpen,
    selectedItem,
  }
}

export default useSelect
