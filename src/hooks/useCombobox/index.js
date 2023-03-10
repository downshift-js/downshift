/* eslint-disable max-statements */
import {useRef, useEffect, useCallback, useMemo} from 'react'
import {isPreact, isReactNative} from '../../is.macro'
import {handleRefs, normalizeArrowKey, callAllEventHandlers} from '../../utils'
import {
  useA11yMessageSetter,
  useMouseAndTouchTracker,
  useGetterPropsCalledChecker,
  useLatestRef,
  useScrollIntoView,
  useControlPropsValidator,
  useElementIds,
  getItemAndIndex,
} from '../utils'
import {
  getInitialState,
  defaultProps,
  useControlledReducer,
  validatePropTypes,
} from './utils'
import downshiftUseComboboxReducer from './reducer'
import * as stateChangeTypes from './stateChangeTypes'

useCombobox.stateChangeTypes = stateChangeTypes

function useCombobox(userProps = {}) {
  validatePropTypes(userProps, useCombobox)
  // Props defaults and destructuring.
  const props = {
    ...defaultProps,
    ...userProps,
  }
  const {
    initialIsOpen,
    defaultIsOpen,
    items,
    scrollIntoView,
    environment,
    getA11yStatusMessage,
    getA11ySelectionMessage,
    itemToString,
  } = props
  // Initial state depending on controlled props.
  const initialState = getInitialState(props)
  const [state, dispatch] = useControlledReducer(
    downshiftUseComboboxReducer,
    initialState,
    props,
  )
  const {isOpen, highlightedIndex, selectedItem, inputValue} = state

  // Element refs.
  const menuRef = useRef(null)
  const itemRefs = useRef({})
  const inputRef = useRef(null)
  const toggleButtonRef = useRef(null)
  const isInitialMountRef = useRef(true)
  // prevent id re-generation between renders.
  const elementIds = useElementIds(props)
  // used to keep track of how many items we had on previous cycle.
  const previousResultCountRef = useRef()
  // utility callback to get item element.
  const latest = useLatestRef({state, props})

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
  useControlPropsValidator({
    isInitialMount: isInitialMountRef.current,
    props,
    state,
  })
  // Focus the input on first render if required.
  useEffect(() => {
    const focusOnOpen = initialIsOpen || defaultIsOpen || isOpen

    if (focusOnOpen && inputRef.current) {
      inputRef.current.focus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    if (isInitialMountRef.current) {
      return
    }

    previousResultCountRef.current = items.length
  })
  // Add mouse/touch events to document.
  const mouseAndTouchTrackersRef = useMouseAndTouchTracker(
    isOpen,
    [inputRef, menuRef, toggleButtonRef],
    environment,
    () => {
      dispatch({
        type: stateChangeTypes.InputBlur,
        selectItem: false,
      })
    },
  )
  const setGetterPropCallInfo = useGetterPropsCalledChecker(
    'getInputProps',
    'getMenuProps',
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
    } else if (environment.document?.activeElement !== inputRef.current) {
      inputRef?.current?.focus()
    }
  }, [isOpen, environment])

  /* Event handler functions */
  const inputKeyDownHandlers = useMemo(
    () => ({
      ArrowDown(event) {
        event.preventDefault()
        dispatch({
          type: stateChangeTypes.InputKeyDownArrowDown,
          altKey: event.altKey,
          getItemNodeFromIndex,
        })
      },
      ArrowUp(event) {
        event.preventDefault()
        dispatch({
          type: stateChangeTypes.InputKeyDownArrowUp,
          altKey: event.altKey,
          getItemNodeFromIndex,
        })
      },
      Home(event) {
        if (!latest.current.state.isOpen) {
          return
        }

        event.preventDefault()
        dispatch({
          type: stateChangeTypes.InputKeyDownHome,
          getItemNodeFromIndex,
        })
      },
      End(event) {
        if (!latest.current.state.isOpen) {
          return
        }

        event.preventDefault()
        dispatch({
          type: stateChangeTypes.InputKeyDownEnd,
          getItemNodeFromIndex,
        })
      },
      Escape(event) {
        const latestState = latest.current.state
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
      Enter(event) {
        const latestState = latest.current.state
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
          getItemNodeFromIndex,
        })
      },
      PageUp(event) {
        if (latest.current.state.isOpen) {
          event.preventDefault()

          dispatch({
            type: stateChangeTypes.InputKeyDownPageUp,
            getItemNodeFromIndex,
          })
        }
      },
      PageDown(event) {
        if (latest.current.state.isOpen) {
          event.preventDefault()

          dispatch({
            type: stateChangeTypes.InputKeyDownPageDown,
            getItemNodeFromIndex,
          })
        }
      },
    }),
    [dispatch, latest, getItemNodeFromIndex],
  )

  // Getter props.
  const getLabelProps = useCallback(
    labelProps => ({
      id: elementIds.labelId,
      htmlFor: elementIds.inputId,
      ...labelProps,
    }),
    [elementIds],
  )
  const getMenuProps = useCallback(
    (
      {onMouseLeave, refKey = 'ref', ref, ...rest} = {},
      {suppressRefError = false} = {},
    ) => {
      setGetterPropCallInfo('getMenuProps', suppressRefError, refKey, menuRef)
      return {
        [refKey]: handleRefs(ref, menuNode => {
          menuRef.current = menuNode
        }),
        id: elementIds.menuId,
        role: 'listbox',
        'aria-labelledby': elementIds.labelId,
        onMouseLeave: callAllEventHandlers(onMouseLeave, () => {
          dispatch({
            type: stateChangeTypes.MenuMouseLeave,
          })
        }),
        ...rest,
      }
    },
    [dispatch, setGetterPropCallInfo, elementIds],
  )

  const getItemProps = useCallback(
    ({
      item: itemProp,
      index: indexProp,
      refKey = 'ref',
      ref,
      onMouseMove,
      onMouseDown,
      onClick,
      onPress,
      disabled,
      ...rest
    } = {}) => {
      const {props: latestProps, state: latestState} = latest.current
      const [, index] = getItemAndIndex(
        itemProp,
        indexProp,
        latestProps.items,
        'Pass either item or index to getItemProps!',
      )

      const onSelectKey = isReactNative
        ? /* istanbul ignore next (react-native) */ 'onPress'
        : 'onClick'
      const customClickHandler = isReactNative
        ? /* istanbul ignore next (react-native) */ onPress
        : onClick

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
      const itemHandleMouseDown = e => e.preventDefault()

      return {
        [refKey]: handleRefs(ref, itemNode => {
          if (itemNode) {
            itemRefs.current[elementIds.getItemId(index)] = itemNode
          }
        }),
        disabled,
        role: 'option',
        'aria-selected': `${index === latestState.highlightedIndex}`,
        id: elementIds.getItemId(index),
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
    [dispatch, latest, shouldScrollRef, elementIds],
  )

  const getToggleButtonProps = useCallback(
    ({onClick, onPress, refKey = 'ref', ref, ...rest} = {}) => {
      const latestState = latest.current.state
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
        'aria-expanded': latestState.isOpen,
        id: elementIds.toggleButtonId,
        tabIndex: -1,
        ...(!rest.disabled && {
          ...(isReactNative
            ? /* istanbul ignore next (react-native) */ {
                onPress: callAllEventHandlers(onPress, toggleButtonHandleClick),
              }
            : {
                onClick: callAllEventHandlers(onClick, toggleButtonHandleClick),
              }),
        }),
        ...rest,
      }
    },
    [dispatch, latest, elementIds],
  )
  const getInputProps = useCallback(
    (
      {
        onKeyDown,
        onChange,
        onInput,
        onFocus,
        onBlur,
        onChangeText,
        refKey = 'ref',
        ref,
        ...rest
      } = {},
      {suppressRefError = false} = {},
    ) => {
      setGetterPropCallInfo('getInputProps', suppressRefError, refKey, inputRef)

      const latestState = latest.current.state
      const inputHandleKeyDown = event => {
        const key = normalizeArrowKey(event)
        if (key && inputKeyDownHandlers[key]) {
          inputKeyDownHandlers[key](event)
        }
      }
      const inputHandleChange = event => {
        dispatch({
          type: stateChangeTypes.InputChange,
          inputValue: isReactNative
            ? /* istanbul ignore next (react-native) */ event.nativeEvent.text
            : event.target.value,
        })
      }
      const inputHandleBlur = () => {
        /* istanbul ignore else */
        if (
          latestState.isOpen &&
          !mouseAndTouchTrackersRef.current.isMouseDown
        ) {
          dispatch({
            type: stateChangeTypes.InputBlur,
            selectItem: true,
          })
        }
      }
      const inputHandleFocus = () => {
        if (!latestState.isOpen) {
          dispatch({
            type: stateChangeTypes.InputFocus,
          })
        }
      }

      /* istanbul ignore next (preact) */
      const onChangeKey = isPreact ? 'onInput' : 'onChange'
      let eventHandlers = {}

      if (!rest.disabled) {
        eventHandlers = {
          [onChangeKey]: callAllEventHandlers(
            onChange,
            onInput,
            inputHandleChange,
          ),
          onKeyDown: callAllEventHandlers(onKeyDown, inputHandleKeyDown),
          onBlur: callAllEventHandlers(onBlur, inputHandleBlur),
          onFocus: callAllEventHandlers(onFocus, inputHandleFocus),
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
          text => {
            inputHandleChange({nativeEvent: {text}})
          },
        )
      }

      return {
        [refKey]: handleRefs(ref, inputNode => {
          inputRef.current = inputNode
        }),
        'aria-activedescendant':
          latestState.isOpen && latestState.highlightedIndex > -1
            ? elementIds.getItemId(latestState.highlightedIndex)
            : '',
        'aria-autocomplete': 'list',
        'aria-controls': elementIds.menuId,
        'aria-expanded': latestState.isOpen,
        'aria-labelledby': elementIds.labelId,
        // https://developer.mozilla.org/en-US/docs/Web/Security/Securing_your_site/Turning_off_form_autocompletion
        // revert back since autocomplete="nope" is ignored on latest Chrome and Opera
        autoComplete: 'off',
        id: elementIds.inputId,
        role: 'combobox',
        value: latestState.inputValue,
        ...eventHandlers,
        ...rest,
      }
    },
    [
      dispatch,
      inputKeyDownHandlers,
      latest,
      mouseAndTouchTrackersRef,
      setGetterPropCallInfo,
      elementIds,
    ],
  )

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
  const setInputValue = useCallback(
    newInputValue => {
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
