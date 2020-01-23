/* eslint-disable max-statements */
import {useRef, useEffect} from 'react'
import {
  getElementIds,
  getItemIndex,
  getPropTypesValidator,
  isAcceptedCharacterKey,
  useEnhancedReducer,
  getInitialState,
} from '../utils'
import setStatus from '../../set-a11y-status'
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
    itemToString,
    getA11yStatusMessage,
    getA11ySelectionMessage,
    scrollIntoView,
    environment,
  } = props
  // Initial state depending on controlled props.
  const initialState = getInitialState(props)

  // Reducer init.
  const [
    {isOpen, highlightedIndex, selectedItem, inputValue},
    dispatchWithoutProps,
  ] = useEnhancedReducer(downshiftSelectReducer, initialState, props)
  const dispatch = action => dispatchWithoutProps({props, ...action})

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

  // Some utils.
  const getItemNodeFromIndex = index =>
    environment.document.getElementById(elementIds.current.getItemId(index))

  /* Effects */
  /* Sets a11y status message on changes in isOpen. */
  useEffect(() => {
    if (isInitialMount.current) {
      return
    }

    setStatus(
      getA11yStatusMessage({
        highlightedIndex,
        inputValue,
        isOpen,
        itemToString,
        resultCount: items.length,
        highlightedItem: items[highlightedIndex],
        selectedItem,
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
        highlightedIndex,
        inputValue,
        isOpen,
        itemToString,
        resultCount: items.length,
        highlightedItem: items[highlightedIndex],
        selectedItem,
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
          type: stateChangeTypes.ToggleButtonBlur,
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
          type: stateChangeTypes.ToggleButtonBlur,
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
    Home(event) {
      event.preventDefault()

      dispatch({
        type: stateChangeTypes.ToggleButtonKeyDownHome,
        getItemNodeFromIndex,
      })
    },
    End(event) {
      event.preventDefault()

      dispatch({
        type: stateChangeTypes.ToggleButtonKeyDownEnd,
        getItemNodeFromIndex,
      })
    },
    Escape() {
      dispatch({
        type: stateChangeTypes.ToggleButtonKeyDownEscape,
      })
    },
    Enter(event) {
      event.preventDefault()

      dispatch({
        type: stateChangeTypes.ToggleButtonKeyDownEnter,
      })
    },
    ' '(event) {
      event.preventDefault()

      dispatch({
        type: stateChangeTypes.ToggleButtonKeyDownSpaceButton,
      })
    },
  }

  // Event handlers.
  const toggleButtonHandleBlur = () => {
    const shouldBlur = mouseAndTouchTrackers.current.isMouseDown
    /* istanbul ignore else */
    if (!shouldBlur) {
      dispatch({type: stateChangeTypes.ToggleButtonBlur})
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
  const getMenuProps = ({onMouseLeave, refKey = 'ref', ref, ...rest} = {}) => ({
    [refKey]: handleRefs(ref, menuNode => {
      menuRef.current = menuNode
    }),
    id: elementIds.current.menuId,
    role: 'listbox',
    onMouseLeave: callAllEventHandlers(onMouseLeave, menuHandleMouseLeave),
    ...rest,
  })
  const getToggleButtonProps = ({
    onClick,
    onKeyDown,
    onBlur,
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
      ...(highlightedIndex > -1 && {
        'aria-activedescendant': elementIds.current.getItemId(highlightedIndex),
      }),
      onBlur: callAllEventHandlers(onBlur, toggleButtonHandleBlur),
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
