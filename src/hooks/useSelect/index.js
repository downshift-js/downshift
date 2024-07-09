import {useRef, useEffect, useCallback, useMemo} from 'react'
import {
  isAcceptedCharacterKey,
  useControlledReducer,
  getInitialState,
  useGetterPropsCalledChecker,
  useLatestRef,
  useScrollIntoView,
  useControlPropsValidator,
  useElementIds,
  useMouseAndTouchTracker,
  getItemAndIndex,
  getInitialValue,
  isDropdownsStateEqual,
  useA11yMessageStatus,
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
  const {scrollIntoView, environment, getA11yStatusMessage} = props
  // Initial state depending on controlled props.
  const [state, dispatch] = useControlledReducer(
    downshiftSelectReducer,
    props,
    getInitialState,
    isDropdownsStateEqual,
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
  // Adds an a11y aria live status message if getA11yStatusMessage is passed.
  useA11yMessageStatus(
    getA11yStatusMessage,
    state,
    [isOpen, highlightedIndex, selectedItem, inputValue],
    environment,
  )
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
    props,
    state,
  })
  // Focus the toggle button on first render if required.
  useEffect(() => {
    const focusOnOpen = getInitialValue(props, 'isOpen')

    if (focusOnOpen && toggleButtonRef.current) {
      toggleButtonRef.current.focus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const mouseAndTouchTrackers = useMouseAndTouchTracker(
    environment,
    useCallback(
      function handleBlur() {
        if (latest.current.state.isOpen) {
          dispatch({
            type: stateChangeTypes.ToggleButtonBlur,
          })
        }
      },
      [dispatch, latest],
    ),
    useMemo(() => [menuRef, toggleButtonRef], []),
  )
  const setGetterPropCallInfo = useGetterPropsCalledChecker(
    'getMenuProps',
    'getToggleButtonProps',
  )
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
          altKey: event.altKey,
        })
      },
      ArrowUp(event) {
        event.preventDefault()

        dispatch({
          type: stateChangeTypes.ToggleButtonKeyDownArrowUp,
          altKey: event.altKey,
        })
      },
      Home(event) {
        event.preventDefault()

        dispatch({
          type: stateChangeTypes.ToggleButtonKeyDownHome,
        })
      },
      End(event) {
        event.preventDefault()

        dispatch({
          type: stateChangeTypes.ToggleButtonKeyDownEnd,
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
          })
        }
      },
      PageDown(event) {
        if (latest.current.state.isOpen) {
          event.preventDefault()

          dispatch({
            type: stateChangeTypes.ToggleButtonKeyDownPageDown,
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
          })
        } else {
          dispatch({type: stateChangeTypes.ToggleButtonKeyDownSpaceButton})
        }
      },
    }),
    [dispatch, latest],
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
    ({onClick, ...labelProps} = {}) => {
      const labelHandleClick = () => {
        toggleButtonRef.current?.focus()
      }

      return {
        id: elementIds.labelId,
        htmlFor: elementIds.toggleButtonId,
        onClick: callAllEventHandlers(onClick, labelHandleClick),
        ...labelProps,
      }
    },
    [elementIds],
  )
  const getMenuProps = useCallback(
    (
      {onMouseLeave, refKey = 'ref', ref, ...rest} = {},
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
        'aria-labelledby':
          rest && rest['aria-label'] ? undefined : `${elementIds.labelId}`,
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
        if (latestState.isOpen && !mouseAndTouchTrackers.isMouseDown) {
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
        'aria-labelledby':
          rest && rest['aria-label'] ? undefined : `${elementIds.labelId}`,
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
      dispatch,
      elementIds,
      latest,
      mouseAndTouchTrackers,
      setGetterPropCallInfo,
      toggleButtonKeyDownHandlers,
    ],
  )
  const getItemProps = useCallback(
    ({
      item: itemProp,
      index: indexProp,
      onMouseMove,
      onClick,
      onMouseDown,
      onPress,
      refKey = 'ref',
      disabled: disabledProp,
      ref,
      ...rest
    } = {}) => {
      if (disabledProp !== undefined) {
        console.warn(
          'Passing "disabled" as an argument to getItemProps is not supported anymore. Please use the isItemDisabled prop from useSelect.',
        )
      }

      const {state: latestState, props: latestProps} = latest.current
      const [item, index] = getItemAndIndex(
        itemProp,
        indexProp,
        latestProps.items,
        'Pass either item or index to getItemProps!',
      )
      const disabled = latestProps.isItemDisabled(item, index)

      const itemHandleMouseMove = () => {
        if (
          mouseAndTouchTrackers.isTouchEnd ||
          index === latestState.highlightedIndex
        ) {
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
      const itemHandleMouseDown = e => e.preventDefault() // keep focus on the toggle after item click select.

      const itemProps = {
        [refKey]: handleRefs(ref, itemNode => {
          if (itemNode) {
            itemRefs.current[elementIds.getItemId(index)] = itemNode
          }
        }),
        'aria-disabled': disabled,
        'aria-selected': item === latestState.selectedItem,
        id: elementIds.getItemId(index),
        role: 'option',
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
      itemProps.onMouseDown = callAllEventHandlers(
        onMouseDown,
        itemHandleMouseDown,
      )

      return itemProps
    },
    [latest, elementIds, mouseAndTouchTrackers, shouldScrollRef, dispatch],
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
