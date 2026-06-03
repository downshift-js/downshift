import React, {useRef, useEffect, useCallback, useMemo} from 'react'
import {isPreact, isReactNative, isReactNativeWeb} from '../../is.macro'
import {
  validatePropTypes,
  callAllEventHandlers,
  handleRefs,
  normalizeArrowKey,
} from '../../utils'
import {
  isDropdownStateEqual,
  getItemAndIndex,
  getInitialValue,
  useIsInitialMount,
  useA11yMessageStatus,
  dropdownDefaultStateValues,
  useElementIds,
  useControlPropsValidator,
  useMouseAndTouchTracker,
  useGetterPropsCalledChecker,
  dropdownDefaultProps,
  useScrollIntoView,
} from '../utils'
import {getInitialState, useControlledReducer, propTypes} from './utils'
import downshiftUseComboboxReducer from './reducer'
import * as stateChangeTypes from './stateChangeTypes'
import {
  UseComboboxGetInputProps,
  UseComboboxGetInputPropsReturnValue,
  UseComboboxGetItemProps,
  UseComboboxGetLabelProps,
  UseComboboxGetMenuProps,
  UseComboboxGetToggleButtonProps,
  UseComboboxMergedProps,
  UseComboboxProps,
  UseComboboxReturnValue,
} from './index.types'

useCombobox.stateChangeTypes = stateChangeTypes

function useCombobox<Item>(
  userProps: UseComboboxProps<Item> = {} as UseComboboxProps<Item>,
): UseComboboxReturnValue<Item> {
  validatePropTypes(userProps, useCombobox, propTypes)
  // Props defaults and destructuring.
  const props: UseComboboxMergedProps<Item> = {
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
  const [state, dispatch] = useControlledReducer(
    downshiftUseComboboxReducer,
    props,
    getInitialState,
    isDropdownStateEqual,
  )
  const {isOpen, highlightedIndex, selectedItem, inputValue} = state

  // Element refs.
  const menuRef = useRef<HTMLElement | null>(null)
  const itemsRef = useRef<Record<string, HTMLElement>>({})
  const inputRef = useRef<HTMLInputElement | null>(null)
  const toggleButtonRef = useRef<HTMLElement | null>(null)
  const isInitialMount = useIsInitialMount()

  // prevent id re-generation between renders.
  const elementIds = useElementIds(props)
  // used to keep track of how many items we had on previous cycle.
  const previousResultCountRef = useRef<number>()
  /**
   * Ref to read `state` in handlers to preserve referential identity.
   * Only to be used in handlers and effects.
   * **never access this in getters**
   */
  const stateRef = useRef(state)
  useEffect(() => {
    stateRef.current = state
  }, [state])

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
  useControlPropsValidator({
    state,
    props,
  })
  // Focus the input on first render if required.
  useEffect(() => {
    const focusOnOpen = getInitialValue(
      props.isOpen,
      props.initialIsOpen,
      props.defaultIsOpen,
      dropdownDefaultStateValues.isOpen,
    )

    if (focusOnOpen && inputRef.current) {
      inputRef.current.focus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    if (!isInitialMount) {
      previousResultCountRef.current = items.length
    }
  })

  const handleBlurInTracker = useCallback(
    function handleBlur() {
      if (stateRef.current.isOpen) {
        dispatch({
          type: stateChangeTypes.InputBlur,
        })
      }
    },
    [dispatch],
  )
  const downshiftRefs = useMemo(() => [menuRef, toggleButtonRef, inputRef], [])
  const mouseAndTouchTrackers = useMouseAndTouchTracker(
    environment,
    handleBlurInTracker,
    downshiftRefs,
  )
  const setGetterPropCallInfo = useGetterPropsCalledChecker(
    'getInputProps',
    'getMenuProps',
  )
  // Reset itemRefs on close.
  useEffect(() => {
    if (!isOpen) {
      itemsRef.current = {}
    }
  }, [isOpen])
  // Reset itemRefs on close.
  useEffect(() => {
    if (!isOpen || !environment?.document || !inputRef.current?.focus) {
      return
    }

    if (environment.document.activeElement !== inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen, environment])

  /* Event handler functions */
  const inputKeyDownHandlers = useMemo(
    () => ({
      ArrowDown(event: KeyboardEvent) {
        event.preventDefault()
        dispatch({
          type: stateChangeTypes.InputKeyDownArrowDown,
          altKey: event.altKey,
        })
      },
      ArrowUp(event: KeyboardEvent) {
        event.preventDefault()
        dispatch({
          type: stateChangeTypes.InputKeyDownArrowUp,
          altKey: event.altKey,
        })
      },
      Home(event: KeyboardEvent) {
        if (!stateRef.current.isOpen) {
          return
        }

        event.preventDefault()
        dispatch({
          type: stateChangeTypes.InputKeyDownHome,
        })
      },
      End(event: KeyboardEvent) {
        if (!stateRef.current.isOpen) {
          return
        }

        event.preventDefault()
        dispatch({
          type: stateChangeTypes.InputKeyDownEnd,
        })
      },
      Escape(event: KeyboardEvent) {
        const latestState = stateRef.current
        if (
          latestState.isOpen ||
          latestState.inputValue ||
          latestState.selectedItem ||
          latestState.highlightedIndex > -1
        ) {
          event.preventDefault()

          dispatch({
            type: stateChangeTypes.InputKeyDownEscape,
          })
        }
      },
      Enter(event: KeyboardEvent) {
        const latestState = stateRef.current
        // if closed or no highlighted index, do nothing.
        if (
          !latestState.isOpen ||
          event.which === 229 // if IME composing, wait for next Enter keydown event.
        ) {
          return
        }

        event.preventDefault()
        dispatch({
          type: stateChangeTypes.InputKeyDownEnter,
        })
      },
      PageUp(event: KeyboardEvent) {
        if (stateRef.current.isOpen) {
          event.preventDefault()

          dispatch({
            type: stateChangeTypes.InputKeyDownPageUp,
          })
        }
      },
      PageDown(event: KeyboardEvent) {
        if (stateRef.current.isOpen) {
          event.preventDefault()

          dispatch({
            type: stateChangeTypes.InputKeyDownPageDown,
          })
        }
      },
    }),
    [dispatch],
  )

  // Getter props.
  const getLabelProps = useCallback(
    labelProps => ({
      id: elementIds.labelId,
      htmlFor: elementIds.inputId,
      ...labelProps,
    }),
    [elementIds],
  ) as UseComboboxGetLabelProps

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

      setGetterPropCallInfo('getMenuProps', suppressRefError, refKey, menuRef)

      return {
        [refKey]: handleRefs(ref, menuNode => {
          menuRef.current = menuNode
        }),
        id: elementIds.menuId,
        role: 'listbox',
        'aria-label': ariaLabel,
        'aria-labelledby': ariaLabel ? undefined : `${elementIds.labelId}`,
        onMouseLeave: callAllEventHandlers(onMouseLeave, () => {
          dispatch({
            type: stateChangeTypes.MenuMouseLeave,
          })
        }),
        ...rest,
      }
    },
    [dispatch, setGetterPropCallInfo, elementIds],
  ) as UseComboboxGetMenuProps

  const getItemProps = useCallback(
    itemProps => {
      const {
        item: itemProp,
        index: indexProp,
        refKey = 'ref',
        ref,
        onMouseMove,
        onMouseDown,
        onClick,
        onPress,
        disabled: disabledProp,
        ...rest
      } = itemProps ?? {}
      if (disabledProp !== undefined) {
        console.warn(
          'Passing "disabled" as an argument to getItemProps is not supported anymore. Please use the isItemDisabled prop from useCombobox.',
        )
      }

      const [item, index] = getItemAndIndex(
        itemProp,
        indexProp,
        items,
        'Pass either item or index to getItemProps!',
      )
      const disabled = isItemDisabled(item, index)
      const onSelectKey =
        isReactNative || isReactNativeWeb
          ? /* istanbul ignore next (react-native) */ 'onPress'
          : 'onClick'
      const customClickHandler = isReactNative
        ? /* istanbul ignore next (react-native) */ onPress
        : onClick

      const itemHandleMouseMove = () => {
        if (
          mouseAndTouchTrackers.isTouchEnd ||
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
      const itemHandleMouseDown = (e: React.MouseEvent) => e.preventDefault() // keep focus on the input after item click select.

      return {
        [refKey]: handleRefs(ref, itemNode => {
          if (itemNode) {
            itemsRef.current[elementIds.getItemId(index)] = itemNode
          }
        }),
        'aria-disabled': disabled,
        'aria-selected': index === state.highlightedIndex,
        id: elementIds.getItemId(index),
        role: 'option',
        ...(!disabled && {
          [onSelectKey]: callAllEventHandlers(
            customClickHandler,
            itemHandleClick,
          ),
        }),
        onMouseMove: callAllEventHandlers(onMouseMove, itemHandleMouseMove),
        onMouseDown: callAllEventHandlers(onMouseDown, itemHandleMouseDown),
        ...rest,
      }
    },

    [
      dispatch,
      elementIds,
      items,
      isItemDisabled,
      state.highlightedIndex,
      mouseAndTouchTrackers,
      preventScroll,
    ],
  ) as UseComboboxGetItemProps<Item>

  const getToggleButtonProps = useCallback(
    toggleButtonProps => {
      const {
        onClick,
        onPress,
        refKey = 'ref',
        ref,
        disabled,
        ...rest
      } = toggleButtonProps ?? {}
      const toggleButtonHandleClick = () => {
        dispatch({
          type: stateChangeTypes.ToggleButtonClick,
        })
      }

      return {
        [refKey]: handleRefs(ref, toggleButtonNode => {
          toggleButtonRef.current = toggleButtonNode
        }),
        'aria-controls': elementIds.menuId,
        'aria-expanded': state.isOpen,
        id: elementIds.toggleButtonId,
        tabIndex: -1,
        ...(!disabled && {
          ...(isReactNative || isReactNativeWeb
            ? /* istanbul ignore next (react-native) */ {
                onPress: callAllEventHandlers(onPress, toggleButtonHandleClick),
              }
            : {
                onClick: callAllEventHandlers(onClick, toggleButtonHandleClick),
              }),
        }),
        disabled,
        ...rest,
      }
    },
    [dispatch, state.isOpen, elementIds],
  ) as UseComboboxGetToggleButtonProps


  const getInputProps = useCallback(
    (inputProps, otherProps) => {
      const {
        'aria-label': ariaLabel,
        disabled,
        onKeyDown,
        onChange,
        onInput,
        onBlur,
        onChangeText,
        onClick,
        refKey = 'ref',
        ref,
        ...rest
      } = inputProps ?? {}
      const {suppressRefError = false} = otherProps ?? {}

      setGetterPropCallInfo('getInputProps', suppressRefError, refKey, inputRef)

      const inputHandleKeyDown = (event: KeyboardEvent) => {
        const key = normalizeArrowKey(event)
        if (key && key in inputKeyDownHandlers) {
          const validKey = key as keyof typeof inputKeyDownHandlers
          inputKeyDownHandlers[validKey](event)
        }
      }
      const inputHandleChange = (
        event:
          | React.ChangeEvent<HTMLInputElement>
          | {nativeEvent: {text: string}},
      ) => {
        dispatch({
          type: stateChangeTypes.InputChange,
          inputValue:
            isReactNative || isReactNativeWeb
              ? /* istanbul ignore next (react-native) */ (
                  event as {nativeEvent: {text: string}}
                ).nativeEvent.text
              : (event as React.ChangeEvent<HTMLInputElement>).target.value,
        })
      }
      const inputHandleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        /* istanbul ignore else */
        if (
          environment?.document &&
          stateRef.current.isOpen &&
          !mouseAndTouchTrackers.isMouseDown
        ) {
          const isBlurByTabChange =
            event.relatedTarget === null &&
            environment.document.activeElement !== environment.document.body

          dispatch({
            type: stateChangeTypes.InputBlur,
            selectItem: !isBlurByTabChange,
          })
        }
      }

      const inputHandleClick = () => {
        dispatch({
          type: stateChangeTypes.InputClick,
        })
      }

      /* istanbul ignore next (preact) */
      const onChangeKey = isPreact ? 'onInput' : 'onChange'
      let eventHandlers = {} as Pick<
        UseComboboxGetInputPropsReturnValue,
        | 'onChange'
        | 'onInput'
        | 'onKeyDown'
        | 'onBlur'
        | 'onClick'
        | 'onChangeText'
      >

      if (!disabled) {
        eventHandlers = {
          [onChangeKey]: callAllEventHandlers(
            onChange,
            onInput,
            inputHandleChange,
          ),
          onKeyDown: callAllEventHandlers(onKeyDown, inputHandleKeyDown),
          onBlur: callAllEventHandlers(onBlur, inputHandleBlur),
          onClick: callAllEventHandlers(onClick, inputHandleClick),
        }
      }

      /* istanbul ignore if (react-native) */
      if (isReactNative) {
        eventHandlers.onChange = callAllEventHandlers(
          onChange,
          onInput,
          inputHandleChange,
        )
        eventHandlers.onChangeText = callAllEventHandlers(
          onChangeText,
          onInput,
          (text: string) => {
            inputHandleChange({nativeEvent: {text}} as {
              nativeEvent: {text: string}
            })
          },
        )
      }

      return {
        [refKey]: handleRefs(ref, inputNode => {
          inputRef.current = inputNode
        }),
        'aria-activedescendant':
          state.isOpen && state.highlightedIndex > -1
            ? elementIds.getItemId(state.highlightedIndex)
            : '',
        'aria-autocomplete': 'list',
        'aria-controls': elementIds.menuId,
        'aria-expanded': state.isOpen,
        'aria-labelledby': ariaLabel ? undefined : elementIds.labelId,
        'aria-label': ariaLabel,
        // https://developer.mozilla.org/en-US/docs/Web/Security/Securing_your_site/Turning_off_form_autocompletion
        // revert back since autocomplete="nope" is ignored on latest Chrome and Opera
        autoComplete: 'off',
        disabled,
        id: elementIds.inputId,
        role: 'combobox',
        value: state.inputValue,
        ...eventHandlers,
        ...rest,
      }
    },
    [
      dispatch,
      elementIds,
      environment,
      inputKeyDownHandlers,
      state.isOpen,
      state.highlightedIndex,
      state.inputValue,
      mouseAndTouchTrackers,
      setGetterPropCallInfo,
    ],
  ) as UseComboboxGetInputProps

  // returns
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
  const setInputValue = useCallback(
    (newInputValue: string) => {
      dispatch({
        type: stateChangeTypes.FunctionSetInputValue,
        inputValue: newInputValue,
      })
    },
    [dispatch],
  )
  const reset = useCallback(() => {
    dispatch({
      type: stateChangeTypes.FunctionReset,
    })
  }, [dispatch])

  return {
    // prop getters.
    getItemProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getToggleButtonProps,
    // actions.
    toggleMenu,
    openMenu,
    closeMenu,
    setHighlightedIndex,
    setInputValue,
    selectItem,
    reset,
    // state.
    highlightedIndex,
    isOpen,
    selectedItem,
    inputValue,
  }
}

export default useCombobox
