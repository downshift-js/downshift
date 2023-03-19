import {useRef, useEffect, useCallback, useMemo} from 'react'
import {
  getItemAndIndex,
  isAcceptedCharacterKey,
  useControlledReducer,
  getInitialState,
  useGetterPropsCalledChecker,
  useLatestRef,
  useA11yMessageSetter,
  useScrollIntoView,
  useControlPropsValidator,
  useElementIds,
  useMouseAndTouchTracker,
} from '../utils'
import {
  callAllEventHandlers,
  handleRefs,
  debounce,
  normalizeArrowKey,
} from '../../utils'
import {isReactNative, isReactNativeWeb} from '../../is.macro'
import downshiftSelectReducer from './reducer'
import {validatePropTypes, defaultProps} from './utils'
import * as stateChangeTypes from './stateChangeTypes'

useSelect.stateChangeTypes = stateChangeTypes

function useSelect(userProps = {}) {
  validatePropTypes(userProps, useSelect)
  // Props defaults and destructuring.
  const props = {
    ...defaultProps,
    ...userProps,
  }
  const {
    items,
    scrollIntoView,
    environment,
    itemToString,
    getA11ySelectionMessage,
    getA11yStatusMessage,
  } = props
  // Initial state depending on controlled props.
  const initialState = getInitialState(props)
  const [state, dispatch] = useControlledReducer(
    downshiftSelectReducer,
    initialState,
    props,
  )
  const {isOpen, highlightedIndex, selectedItem, inputValue} = state

  // Element efs.
  const toggleButtonRef = useRef(null)
  const menuRef = useRef(null)
  const itemRefs = useRef({})
  // used to keep the inputValue clearTimeout object between renders.
  const clearTimeoutRef = useRef(null)
  // prevent id re-generation between renders.
  const elementIds = useElementIds(props)
  // used to keep track of how many items we had on previous cycle.
  const previousResultCountRef = useRef()
  const isInitialMountRef = useRef(true)
  // utility callback to get item element.
  const latest = useLatestRef({
    state,
    props,
  })

  // Some utils.
  const getItemNodeFromIndex = useCallback(
    index => itemRefs.current[elementIds.getItemId(index)],
    [elementIds],
  )

  // Effects.
  // Sets a11y status message on changes in state.
  useA11yMessageSetter(
    getA11yStatusMessage,
    [isOpen, highlightedIndex, inputValue, items],
    {
      isInitialMount: isInitialMountRef.current,
      previousResultCount: previousResultCountRef.current,
      items,
      environment,
      itemToString,
      ...state,
    },
  )
  // Sets a11y status message on changes in selectedItem.
  useA11yMessageSetter(getA11ySelectionMessage, [selectedItem], {
    isInitialMount: isInitialMountRef.current,
    previousResultCount: previousResultCountRef.current,
    items,
    environment,
    itemToString,
    ...state,
  })
  // Scroll on highlighted item if change comes from keyboard.
  const shouldScrollRef = useScrollIntoView({
    menuElement: menuRef.current,
    highlightedIndex,
    isOpen,
    itemRefs,
    scrollIntoView,
    getItemNodeFromIndex,
  })

  // Sets cleanup for the keysSoFar callback, debounded after 500ms.
  useEffect(() => {
    // init the clean function here as we need access to dispatch.
    clearTimeoutRef.current = debounce(outerDispatch => {
      outerDispatch({
        type: stateChangeTypes.FunctionSetInputValue,
        inputValue: '',
      })
    }, 500)

    // Cancel any pending debounced calls on mount
    return () => {
      clearTimeoutRef.current.cancel()
    }
  }, [])

  // Invokes the keysSoFar callback set up above.
  useEffect(() => {
    if (!inputValue) {
      return
    }

    clearTimeoutRef.current(dispatch)
  }, [dispatch, inputValue])

  useControlPropsValidator({
    isInitialMount: isInitialMountRef.current,
    props,
    state,
  })
  useEffect(() => {
    if (isInitialMountRef.current) {
      return
    }

    previousResultCountRef.current = items.length
  })
  // Add mouse/touch events to document.
  const mouseAndTouchTrackersRef = useMouseAndTouchTracker(
    isOpen,
    [menuRef, toggleButtonRef],
    environment,
    () => {
      dispatch({
        type: stateChangeTypes.ToggleButtonBlur,
      })
    },
  )
  const setGetterPropCallInfo = useGetterPropsCalledChecker(
    'getMenuProps',
    'getToggleButtonProps',
  )
  // Make initial ref false.
  useEffect(() => {
    isInitialMountRef.current = false

    return () => {
      isInitialMountRef.current = true
    }
  }, [])
  // Reset itemRefs on close.
  useEffect(() => {
    if (!isOpen) {
      itemRefs.current = {}
    }
  }, [isOpen])

  // Event handler functions.
  const toggleButtonKeyDownHandlers = useMemo(
    () => ({
      ArrowDown(event) {
        event.preventDefault()

        dispatch({
          type: stateChangeTypes.ToggleButtonKeyDownArrowDown,
          getItemNodeFromIndex,
          altKey: event.altKey,
        })
      },
      ArrowUp(event) {
        event.preventDefault()

        dispatch({
          type: stateChangeTypes.ToggleButtonKeyDownArrowUp,
          getItemNodeFromIndex,
          altKey: event.altKey,
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
        if (latest.current.state.isOpen) {
          dispatch({
            type: stateChangeTypes.ToggleButtonKeyDownEscape,
          })
        }
      },
      Enter(event) {
        event.preventDefault()

        dispatch({
          type: latest.current.state.isOpen
            ? stateChangeTypes.ToggleButtonKeyDownEnter
            : stateChangeTypes.ToggleButtonClick,
        })
      },
      PageUp(event) {
        if (latest.current.state.isOpen) {
          event.preventDefault()

          dispatch({
            type: stateChangeTypes.ToggleButtonKeyDownPageUp,
            getItemNodeFromIndex,
          })
        }
      },
      PageDown(event) {
        if (latest.current.state.isOpen) {
          event.preventDefault()

          dispatch({
            type: stateChangeTypes.ToggleButtonKeyDownPageDown,
            getItemNodeFromIndex,
          })
        }
      },
      ' '(event) {
        event.preventDefault()

        const currentState = latest.current.state

        if (!currentState.isOpen) {
          dispatch({type: stateChangeTypes.ToggleButtonClick})
          return
        }

        if (currentState.inputValue) {
          dispatch({
            type: stateChangeTypes.ToggleButtonKeyDownCharacter,
            key: ' ',
            getItemNodeFromIndex,
          })
        } else {
          dispatch({type: stateChangeTypes.ToggleButtonKeyDownSpaceButton})
        }
      },
    }),
    [dispatch, getItemNodeFromIndex, latest],
  )

  // Action functions.
  const toggleMenu = useCallback(() => {
    dispatch({
      type: stateChangeTypes.FunctionToggleMenu,
    })
  }, [dispatch])
  const closeMenu = useCallback(() => {
    dispatch({
      type: stateChangeTypes.FunctionCloseMenu,
    })
  }, [dispatch])
  const openMenu = useCallback(() => {
    dispatch({
      type: stateChangeTypes.FunctionOpenMenu,
    })
  }, [dispatch])
  const setHighlightedIndex = useCallback(
    newHighlightedIndex => {
      dispatch({
        type: stateChangeTypes.FunctionSetHighlightedIndex,
        highlightedIndex: newHighlightedIndex,
      })
    },
    [dispatch],
  )
  const selectItem = useCallback(
    newSelectedItem => {
      dispatch({
        type: stateChangeTypes.FunctionSelectItem,
        selectedItem: newSelectedItem,
      })
    },
    [dispatch],
  )
  const reset = useCallback(() => {
    dispatch({
      type: stateChangeTypes.FunctionReset,
    })
  }, [dispatch])
  const setInputValue = useCallback(
    newInputValue => {
      dispatch({
        type: stateChangeTypes.FunctionSetInputValue,
        inputValue: newInputValue,
      })
    },
    [dispatch],
  )
  // Getter functions.
  const getLabelProps = useCallback(
    labelProps => ({
      id: elementIds.labelId,
      htmlFor: elementIds.toggleButtonId,
      ...labelProps,
    }),
    [elementIds],
  )
  const getMenuProps = useCallback(
    (
      {onMouseLeave, refKey = 'ref', onKeyDown, onBlur, ref, ...rest} = {},
      {suppressRefError = false} = {},
    ) => {
      const menuHandleMouseLeave = () => {
        dispatch({
          type: stateChangeTypes.MenuMouseLeave,
        })
      }

      setGetterPropCallInfo('getMenuProps', suppressRefError, refKey, menuRef)

      return {
        [refKey]: handleRefs(ref, menuNode => {
          menuRef.current = menuNode
        }),
        id: elementIds.menuId,
        role: 'listbox',
        'aria-labelledby': elementIds.labelId,
        tabIndex: -1,
        onMouseLeave: callAllEventHandlers(onMouseLeave, menuHandleMouseLeave),
        ...rest,
      }
    },
    [dispatch, setGetterPropCallInfo, elementIds],
  )
  const getToggleButtonProps = useCallback(
    (
      {onBlur, onClick, onPress, onKeyDown, refKey = 'ref', ref, ...rest} = {},
      {suppressRefError = false} = {},
    ) => {
      const latestState = latest.current.state
      const toggleButtonHandleClick = () => {
        dispatch({
          type: stateChangeTypes.ToggleButtonClick,
        })
      }
      const toggleButtonHandleBlur = () => {
        if (
          latestState.isOpen &&
          !mouseAndTouchTrackersRef.current.isMouseDown
        ) {
          dispatch({
            type: stateChangeTypes.ToggleButtonBlur,
          })
        }
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
      const toggleProps = {
        [refKey]: handleRefs(ref, toggleButtonNode => {
          toggleButtonRef.current = toggleButtonNode
        }),
        'aria-activedescendant':
          latestState.isOpen && latestState.highlightedIndex > -1
            ? elementIds.getItemId(latestState.highlightedIndex)
            : '',
        'aria-controls': elementIds.menuId,
        'aria-expanded': latest.current.state.isOpen,
        'aria-haspopup': 'listbox',
        'aria-labelledby': `${elementIds.labelId}`,
        id: elementIds.toggleButtonId,
        role: 'combobox',
        tabIndex: 0,
        onBlur: callAllEventHandlers(onBlur, toggleButtonHandleBlur),
        ...rest,
      }

      if (!rest.disabled) {
        /* istanbul ignore if (react-native) */
        if (isReactNative || isReactNativeWeb) {
          toggleProps.onPress = callAllEventHandlers(
            onPress,
            toggleButtonHandleClick,
          )
        } else {
          toggleProps.onClick = callAllEventHandlers(
            onClick,
            toggleButtonHandleClick,
          )
          toggleProps.onKeyDown = callAllEventHandlers(
            onKeyDown,
            toggleButtonHandleKeyDown,
          )
        }
      }

      setGetterPropCallInfo(
        'getToggleButtonProps',
        suppressRefError,
        refKey,
        toggleButtonRef,
      )

      return toggleProps
    },
    [
      latest,
      elementIds,
      setGetterPropCallInfo,
      dispatch,
      mouseAndTouchTrackersRef,
      toggleButtonKeyDownHandlers,
      getItemNodeFromIndex,
    ],
  )
  const getItemProps = useCallback(
    ({
      item: itemProp,
      index: indexProp,
      onMouseMove,
      onClick,
      onPress,
      refKey = 'ref',
      ref,
      disabled,
      ...rest
    } = {}) => {
      const {state: latestState, props: latestProps} = latest.current
      const [item, index] = getItemAndIndex(
        itemProp,
        indexProp,
        latestProps.items,
        'Pass either item or index to getItemProps!',
      )

      const itemHandleMouseMove = () => {
        if (index === latestState.highlightedIndex) {
          return
        }
        shouldScrollRef.current = false
        dispatch({
          type: stateChangeTypes.ItemMouseMove,
          index,
          disabled,
        })
      }
      const itemHandleClick = () => {
        dispatch({
          type: stateChangeTypes.ItemClick,
          index,
        })
      }

      const itemProps = {
        disabled,
        role: 'option',
        'aria-selected': `${item === selectedItem}`,
        id: elementIds.getItemId(index),
        [refKey]: handleRefs(ref, itemNode => {
          if (itemNode) {
            itemRefs.current[elementIds.getItemId(index)] = itemNode
          }
        }),
        ...rest,
      }

      if (!disabled) {
        /* istanbul ignore next (react-native) */
        if (isReactNative || isReactNativeWeb) {
          itemProps.onPress = callAllEventHandlers(onPress, itemHandleClick)
        } else {
          itemProps.onClick = callAllEventHandlers(onClick, itemHandleClick)
        }
      }

      itemProps.onMouseMove = callAllEventHandlers(
        onMouseMove,
        itemHandleMouseMove,
      )

      return itemProps
    },
    [latest, selectedItem, elementIds, shouldScrollRef, dispatch],
  )

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
