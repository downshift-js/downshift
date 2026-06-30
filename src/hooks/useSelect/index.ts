import React, {useRef, useEffect, useCallback, useMemo} from 'react'
import {
  validatePropTypes,
  useLatestRef,
  callAllEventHandlers,
  handleRefs,
  debounce,
  normalizeArrowKey,
} from '../../utils'
import {
  isDropdownStateEqual,
  useControlledReducer,
  getInitialValue,
  getItemAndIndex,
  useA11yMessageStatus,
  dropdownDefaultStateValues,
  useElementIds,
  useControlPropsValidator,
  getInitialState,
  useMouseAndTouchTracker,
  useGetterPropsCalledChecker,
  dropdownDefaultProps,
  useScrollIntoView,
} from '../utils'
import {GetPropsCommonOptions} from '../../downshift.types'
import {isReactNative, isReactNativeWeb} from '../../is.macro'
import downshiftSelectReducer from './reducer'
import {propTypes} from './utils'
import * as stateChangeTypes from './stateChangeTypes'
import {
  UseSelectGetItemProps,
  UseSelectGetLabelProps,
  UseSelectGetMenuProps,
  UseSelectGetToggleButtonProps,
  UseSelectGetToggleButtonPropsOptions,
  UseSelectMergedProps,
  UseSelectProps,
  UseSelectReducerAction,
  UseSelectReturnValue,
  UseSelectState,
} from './index.types'

useSelect.stateChangeTypes = stateChangeTypes

function useSelect<Item>(
  userProps: UseSelectProps<Item> = {} as UseSelectProps<Item>,
): UseSelectReturnValue<Item> {
  validatePropTypes(userProps, useSelect, propTypes)
  // Props defaults and destructuring.
  const props: UseSelectMergedProps<Item> = {
    ...dropdownDefaultProps,
    ...userProps,
  }
  const {
    items,
    isItemDisabled,
    scrollIntoView,
    environment,
    getA11yStatusMessage,
  } = props
  // Initial state depending on controlled props.
  const [state, dispatch] = useControlledReducer<
    UseSelectState<Item>,
    UseSelectReducerAction<Item>,
    UseSelectMergedProps<Item>
  >(downshiftSelectReducer, props, getInitialState, isDropdownStateEqual)
  const {isOpen, highlightedIndex, selectedItem, inputValue} = state

  // Element refs.
  const toggleButtonRef = useRef<HTMLElement | null>(null)
  const menuRef = useRef<HTMLElement | null>(null)
  const itemsRef = useRef<Record<string, HTMLElement>>({})

  // used to keep the inputValue clearTimeout object between renders.
  const clearTimeoutRef = useRef<ReturnType<typeof debounce> | null>(null)
  // prevent id re-generation between renders.
  const elementIds = useElementIds(props)
  /**
   * Ref to read `state` in handlers to preserve referential identity.
   * Only to be used in handlers and effects.
   * **never access this in getters**
   */
  const stateRef = useLatestRef(state)

  // Effects.
  // Adds an a11y aria live status message if getA11yStatusMessage is passed.
  useA11yMessageStatus(
    getA11yStatusMessage,
    state,
    [isOpen, highlightedIndex, selectedItem, inputValue],
    environment,
  )
  // Scroll on highlighted item if change comes from keyboard.
  const preventScroll = useScrollIntoView(
    scrollIntoView,
    highlightedIndex,
    isOpen,
    menuRef,
    itemsRef,
    elementIds.getItemId,
  )
  // Sets cleanup for the keysSoFar callback, debounced after 500ms.
  useEffect(() => {
    // init the clean function here as we need access to dispatch.
    clearTimeoutRef.current = debounce((outerDispatch: typeof dispatch) => {
      outerDispatch({
        type: stateChangeTypes.FunctionSetInputValue,
        inputValue: '',
      })
    }, 500)

    // Cancel any pending debounced calls on mount
    return () => {
      clearTimeoutRef.current?.cancel()
    }
  }, [])
  // Invokes the keysSoFar callback set up above.
  useEffect(() => {
    if (!inputValue) {
      return
    }

    clearTimeoutRef.current?.(dispatch)
  }, [dispatch, inputValue])

  useControlPropsValidator({
    props,
    state,
  })
  // Focus the toggle button on first render if required.
  useEffect(() => {
    const focusOnOpen = getInitialValue(
      props.isOpen,
      props.initialIsOpen,
      props.defaultIsOpen,
      dropdownDefaultStateValues.isOpen,
    )

    if (focusOnOpen && toggleButtonRef.current) {
      toggleButtonRef.current.focus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleBlurInTracker = useCallback(
    function handleBlur() {
      if (stateRef.current.isOpen) {
        dispatch({
          type: stateChangeTypes.ToggleButtonBlur,
        })
      }
    },
    [dispatch, stateRef],
  )
  const downshiftRefs = useMemo(() => [menuRef, toggleButtonRef], [])
  const mouseAndTouchTrackers = useMouseAndTouchTracker(
    environment,
    handleBlurInTracker,
    downshiftRefs,
  )
  const setGetterPropCallInfo = useGetterPropsCalledChecker(
    'getMenuProps',
    'getToggleButtonProps',
  )
  // Reset itemRefs on close.
  useEffect(() => {
    if (!isOpen) {
      itemsRef.current = {}
    }
  }, [isOpen])

  // Event handler functions.
  const toggleButtonKeyDownHandlers = useMemo(
    () => ({
      ArrowDown(event: KeyboardEvent) {
        event.preventDefault()

        dispatch({
          type: stateChangeTypes.ToggleButtonKeyDownArrowDown,
          altKey: event.altKey,
        })
      },
      ArrowUp(event: KeyboardEvent) {
        event.preventDefault()

        dispatch({
          type: stateChangeTypes.ToggleButtonKeyDownArrowUp,
          altKey: event.altKey,
        })
      },
      Home(event: KeyboardEvent) {
        event.preventDefault()

        dispatch({
          type: stateChangeTypes.ToggleButtonKeyDownHome,
        })
      },
      End(event: KeyboardEvent) {
        event.preventDefault()

        dispatch({
          type: stateChangeTypes.ToggleButtonKeyDownEnd,
        })
      },
      Escape() {
        if (stateRef.current.isOpen) {
          dispatch({
            type: stateChangeTypes.ToggleButtonKeyDownEscape,
          })
        }
      },
      Enter(event: KeyboardEvent) {
        event.preventDefault()

        dispatch({
          type: stateRef.current.isOpen
            ? stateChangeTypes.ToggleButtonKeyDownEnter
            : stateChangeTypes.ToggleButtonClick,
        })
      },
      PageUp(event: KeyboardEvent) {
        if (stateRef.current.isOpen) {
          event.preventDefault()

          dispatch({
            type: stateChangeTypes.ToggleButtonKeyDownPageUp,
          })
        }
      },
      PageDown(event: KeyboardEvent) {
        if (stateRef.current.isOpen) {
          event.preventDefault()

          dispatch({
            type: stateChangeTypes.ToggleButtonKeyDownPageDown,
          })
        }
      },
      ' '(event: KeyboardEvent) {
        event.preventDefault()

        const currentState = stateRef.current

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
    [dispatch, stateRef],
  )

  // Getter functions.
  const getLabelProps = useCallback(
    labelProps => {
      const {onClick, ...rest} = labelProps ?? {}
      const labelHandleClick = () => {
        toggleButtonRef.current?.focus()
      }

      return {
        id: elementIds.labelId,
        htmlFor: elementIds.toggleButtonId,
        onClick: callAllEventHandlers(onClick, labelHandleClick),
        ...rest,
      }
    },
    [elementIds],
  ) as UseSelectGetLabelProps

  const getMenuProps = useCallback(
    (menuProps, otherProps) => {
      const {
        onMouseLeave,
        refKey = 'ref',
        ref,
        'aria-label': ariaLabel,
        ...rest
      } = menuProps ?? {}
      const {suppressRefError = false} = otherProps ?? {}

      const menuHandleMouseLeave = () => {
        dispatch({
          type: stateChangeTypes.MenuMouseLeave,
        })
      }

      setGetterPropCallInfo('getMenuProps', suppressRefError, refKey, menuRef)

      return {
        [refKey]: handleRefs(ref, (menuNode: HTMLElement | null) => {
          menuRef.current = menuNode
        }),
        id: elementIds.menuId,
        role: 'listbox',
        'aria-label': ariaLabel,
        'aria-labelledby': ariaLabel ? undefined : `${elementIds.labelId}`,
        onMouseLeave: callAllEventHandlers(onMouseLeave, menuHandleMouseLeave),
        ...rest,
      }
    },
    [dispatch, setGetterPropCallInfo, elementIds],
  ) as UseSelectGetMenuProps

  const getToggleButtonProps = useCallback(
    (
      toggleButtonProps?: UseSelectGetToggleButtonPropsOptions,
      otherProps?: GetPropsCommonOptions,
    ) => {
      const {
        onBlur,
        onClick,
        onPress,
        onKeyDown,
        refKey = 'ref',
        ref,
        ...rest
      } = toggleButtonProps ?? {}
      const {suppressRefError = false} = otherProps ?? {}

      const toggleButtonHandleClick = () => {
        dispatch({
          type: stateChangeTypes.ToggleButtonClick,
        })
      }
      const toggleButtonHandleBlur = () => {
        if (
          stateRef.current.isOpen &&
          !mouseAndTouchTrackers.current.isMouseDown
        ) {
          dispatch({
            type: stateChangeTypes.ToggleButtonBlur,
          })
        }
      }
      const toggleButtonHandleKeyDown = (event: KeyboardEvent) => {
        const key = normalizeArrowKey(event)
        if (key && key in toggleButtonKeyDownHandlers) {
          toggleButtonKeyDownHandlers[
            key as keyof typeof toggleButtonKeyDownHandlers
          ](event)
        } else if (/^\S{1}$/.test(key)) {
          dispatch({
            type: stateChangeTypes.ToggleButtonKeyDownCharacter,
            key,
          })
        }
      }

      const toggleProps = {
        [refKey]: handleRefs(
          ref as React.Ref<HTMLElement>,
          (toggleButtonNode: HTMLElement | null) => {
            toggleButtonRef.current = toggleButtonNode
          },
        ),
        'aria-activedescendant':
          isOpen && highlightedIndex > -1
            ? elementIds.getItemId(highlightedIndex)
            : '',
        'aria-controls': elementIds.menuId,
        'aria-expanded': isOpen,
        'aria-haspopup': 'listbox',
        'aria-labelledby': rest['aria-label']
          ? undefined
          : `${elementIds.labelId}`,
        id: elementIds.toggleButtonId,
        role: 'combobox',
        tabIndex: 0,
        onBlur: callAllEventHandlers(onBlur, toggleButtonHandleBlur),
        ...rest,
      }

      if (!rest.disabled) {
        /* istanbul ignore if (react-native) */
        if (isReactNative || isReactNativeWeb) {
          Object.assign(toggleProps, {
            onPress: callAllEventHandlers(onPress, toggleButtonHandleClick),
          })
        } else {
          Object.assign(toggleProps, {
            onClick: callAllEventHandlers(onClick, toggleButtonHandleClick),
            onKeyDown: callAllEventHandlers(
              onKeyDown,
              toggleButtonHandleKeyDown,
            ),
          })
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
      isOpen,
      highlightedIndex,
      mouseAndTouchTrackers,
      setGetterPropCallInfo,
      toggleButtonKeyDownHandlers,
      stateRef,
    ],
  ) as UseSelectGetToggleButtonProps

  const getItemProps = useCallback(
    (itemProps?: Parameters<UseSelectGetItemProps<Item>>[0]) => {
      const {
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
      } = itemProps ?? {}

      if (disabledProp !== undefined) {
        console.warn(
          'Passing "disabled" as an argument to getItemProps is not supported anymore. Please use the isItemDisabled prop from useSelect.',
        )
      }

      const [item, index] = getItemAndIndex(
        itemProp,
        indexProp,
        items,
        'Pass either item or index to getItemProps!',
      )
      const disabled = isItemDisabled(item, index)

      const itemHandleMouseMove = () => {
        if (
          mouseAndTouchTrackers.current.isTouchEnd ||
          index === stateRef.current.highlightedIndex
        ) {
          return
        }
        preventScroll()
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
      const itemHandleMouseDown = (e: React.MouseEvent) => e.preventDefault() // keep focus on the toggle after item click select.

      const resultItemProps = {
        [refKey]: handleRefs(
          ref as React.Ref<HTMLElement>,
          (itemNode: HTMLElement | null) => {
            if (itemNode) {
              itemsRef.current[elementIds.getItemId(index)] = itemNode
            }
          },
        ),
        'aria-disabled': disabled,
        'aria-selected': item === selectedItem,
        id: elementIds.getItemId(index),
        role: 'option',
        onMouseMove: callAllEventHandlers(onMouseMove, itemHandleMouseMove),
        onMouseDown: callAllEventHandlers(onMouseDown, itemHandleMouseDown),
        ...rest,
      }

      if (!disabled) {
        /* istanbul ignore next (react-native) */
        if (isReactNative || isReactNativeWeb) {
          Object.assign(resultItemProps, {
            onPress: callAllEventHandlers(onPress, itemHandleClick),
          })
        } else {
          Object.assign(resultItemProps, {
            onClick: callAllEventHandlers(onClick, itemHandleClick),
          })
        }
      }

      return resultItemProps
    },
    [
      items,
      isItemDisabled,
      selectedItem,
      elementIds,
      mouseAndTouchTrackers,
      preventScroll,
      dispatch,
      stateRef,
    ],
  ) as UseSelectGetItemProps<Item>

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
    (newHighlightedIndex: number) => {
      dispatch({
        type: stateChangeTypes.FunctionSetHighlightedIndex,
        highlightedIndex: newHighlightedIndex,
      })
    },
    [dispatch],
  )
  const selectItem = useCallback(
    (newSelectedItem: Item | null) => {
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
    (newInputValue: string) => {
      dispatch({
        type: stateChangeTypes.FunctionSetInputValue,
        inputValue: newInputValue,
      })
    },
    [dispatch],
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
