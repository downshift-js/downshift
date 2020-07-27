/* eslint-disable max-statements */
import {useRef, useEffect, useCallback, useMemo} from 'react'
import {isPreact, isReactNative} from '../../is.macro'
import {
  handleRefs,
  normalizeArrowKey,
  callAllEventHandlers,
  validateControlledUnchanged,
} from '../../utils'
import {
  getItemIndex,
  getPropTypesValidator,
  updateA11yStatus,
  useMouseAndTouchTracker,
  useGetterPropsCalledChecker,
  useLatestRef,
} from '../utils'
import {
  getInitialState,
  propTypes,
  defaultProps,
  getElementIds,
  useControlledReducer,
} from './utils'
import downshiftUseComboboxReducer from './reducer'
import * as stateChangeTypes from './stateChangeTypes'

const validatePropTypes =
  process.env.NODE_ENV === 'production'
    ? /* istanbul ignore next */ null
    : getPropTypesValidator(useCombobox, propTypes)

useCombobox.stateChangeTypes = stateChangeTypes

function useCombobox(userProps = {}) {
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
  const itemRefs = useRef()
  const inputRef = useRef(null)
  const toggleButtonRef = useRef(null)
  const comboboxRef = useRef(null)
  itemRefs.current = {}
  // used not to scroll on highlight by mouse.
  const shouldScrollRef = useRef(true)
  const isInitialMountRef = useRef(true)
  // prevent id re-generation between renders.
  const elementIdsRef = useRef(getElementIds(props))
  // used to keep track of how many items we had on previous cycle.
  const previousResultCountRef = useRef()
  // used for checking when props are moving from controlled to uncontrolled.
  const prevPropsRef = useRef(props)
  // used to store information about getter props being called on render.
  // utility callback to get item element.
  const latest = useLatestRef({state, props})

  const getItemNodeFromIndex = index =>
    itemRefs.current[elementIdsRef.current.getItemId(index)]

  // Effects.
  // Sets a11y status message on changes in state.
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
  // Sets a11y status message on changes in selectedItem.
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
  // Scroll on highlighted item if change comes from keyboard.
  useEffect(() => {
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
      scrollIntoView(getItemNodeFromIndex(highlightedIndex), menuRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlightedIndex])
  // Controls the focus on the menu or the toggle button.
  useEffect(() => {
    // Always scroll to selected item on open
    if (isOpen) {
      shouldScrollRef.current = true
    }
    
    // Don't focus menu on first render.
    if (isInitialMountRef.current) {
      // Unless it was initialised as open.
      if (initialIsOpen || defaultIsOpen || isOpen) {
        if (inputRef.current) {
          inputRef.current.focus()
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])
  useEffect(() => {
    if (isInitialMountRef.current) {
      return
    }

    previousResultCountRef.current = items.length
  })
  useEffect(() => {
    if (isInitialMountRef.current) {
      return
    }

    validateControlledUnchanged(state, prevPropsRef.current, props)
    prevPropsRef.current = props
  }, [state, props])
  // Add mouse/touch events to document.
  const mouseAndTouchTrackersRef = useMouseAndTouchTracker(
    isOpen,
    [comboboxRef, menuRef, toggleButtonRef],
    environment,
    () => {
      dispatch({
        type: stateChangeTypes.InputBlur,
      })
    },
  )
  const setGetterPropCallInfo = useGetterPropsCalledChecker(
    'getInputProps',
    'getComboboxProps',
    'getMenuProps',
  )
  // Make initial ref false.
  useEffect(() => {
    isInitialMountRef.current = false
  }, [])

  /* Event handler functions */
  const inputKeyDownHandlers = useMemo(
    () => ({
      ArrowDown(event) {
        event.preventDefault()
        dispatch({
          type: stateChangeTypes.InputKeyDownArrowDown,
          shiftKey: event.shiftKey,
          getItemNodeFromIndex,
        })
      },
      ArrowUp(event) {
        event.preventDefault()
        dispatch({
          type: stateChangeTypes.InputKeyDownArrowUp,
          shiftKey: event.shiftKey,
          getItemNodeFromIndex,
        })
      },
      Home(event) {
        event.preventDefault()
        dispatch({
          type: stateChangeTypes.InputKeyDownHome,
          getItemNodeFromIndex,
        })
      },
      End(event) {
        event.preventDefault()
        dispatch({
          type: stateChangeTypes.InputKeyDownEnd,
          getItemNodeFromIndex,
        })
      },
      Escape() {
        dispatch({
          type: stateChangeTypes.InputKeyDownEscape,
        })
      },
      Enter(event) {
        // if IME composing, wait for next Enter keydown event.
        if (event.which === 229) {
          return
        }
        const latestState = latest.current.state

        if (latestState.isOpen && latestState.highlightedIndex > -1) {
          event.preventDefault()
          dispatch({
            type: stateChangeTypes.InputKeyDownEnter,
            getItemNodeFromIndex,
          })
        }
      },
    }),
    [dispatch, latest],
  )

  // Getter props.
  const getLabelProps = useCallback(
    labelProps => ({
      id: elementIdsRef.current.labelId,
      htmlFor: elementIdsRef.current.inputId,
      ...labelProps,
    }),
    [],
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
        id: elementIdsRef.current.menuId,
        role: 'listbox',
        'aria-labelledby': elementIdsRef.current.labelId,
        onMouseLeave: callAllEventHandlers(onMouseLeave, () => {
          dispatch({
            type: stateChangeTypes.MenuMouseLeave,
          })
        }),
        ...rest,
      }
    },
    [dispatch, setGetterPropCallInfo],
  )

  const getItemProps = useCallback(
    ({
      item,
      index,
      refKey = 'ref',
      ref,
      onMouseMove,
      onClick,
      onPress,
      ...rest
    } = {}) => {
      const {props: latestProps, state: latestState} = latest.current
      const itemIndex = getItemIndex(index, item, latestProps.items)
      if (itemIndex < 0) {
        throw new Error('Pass either item or item index in getItemProps!')
      }

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
        })
      }
      const itemHandleClick = () => {
        dispatch({
          type: stateChangeTypes.ItemClick,
          index,
        })
      }

      return {
        [refKey]: handleRefs(ref, itemNode => {
          if (itemNode) {
            itemRefs.current[
              elementIdsRef.current.getItemId(itemIndex)
            ] = itemNode
          }
        }),
        role: 'option',
        'aria-selected': `${itemIndex === latestState.highlightedIndex}`,
        id: elementIdsRef.current.getItemId(itemIndex),
        ...(!rest.disabled && {
          onMouseMove: callAllEventHandlers(onMouseMove, itemHandleMouseMove),
          [onSelectKey]: callAllEventHandlers(
            customClickHandler,
            itemHandleClick,
          ),
        }),
        ...rest,
      }
    },
    [dispatch, latest],
  )

  const getToggleButtonProps = useCallback(
    ({onClick, onPress, refKey = 'ref', ref, ...rest} = {}) => {
      const toggleButtonHandleClick = () => {
        dispatch({
          type: stateChangeTypes.ToggleButtonClick,
        })

        if (!latest.current.state.isOpen && inputRef.current) {
          inputRef.current.focus()
        }
      }

      return {
        [refKey]: handleRefs(ref, toggleButtonNode => {
          toggleButtonRef.current = toggleButtonNode
        }),
        id: elementIdsRef.current.toggleButtonId,
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
    [dispatch, latest],
  )
  const getInputProps = useCallback(
    (
      {
        onKeyDown,
        onChange,
        onInput,
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
        if (!mouseAndTouchTrackersRef.current.isMouseDown) {
          dispatch({
            type: stateChangeTypes.InputBlur,
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
        id: elementIdsRef.current.inputId,
        'aria-autocomplete': 'list',
        'aria-controls': elementIdsRef.current.menuId,
        ...(latestState.isOpen &&
          latestState.highlightedIndex > -1 && {
            'aria-activedescendant': elementIdsRef.current.getItemId(
              latestState.highlightedIndex,
            ),
          }),
        'aria-labelledby': elementIdsRef.current.labelId,
        // https://developer.mozilla.org/en-US/docs/Web/Security/Securing_your_site/Turning_off_form_autocompletion
        // revert back since autocomplete="nope" is ignored on latest Chrome and Opera
        autoComplete: 'off',
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
    ],
  )
  const getComboboxProps = useCallback(
    ({refKey = 'ref', ref, ...rest} = {}, {suppressRefError = false} = {}) => {
      setGetterPropCallInfo(
        'getComboboxProps',
        suppressRefError,
        refKey,
        comboboxRef,
      )

      return {
        [refKey]: handleRefs(ref, comboboxNode => {
          comboboxRef.current = comboboxNode
        }),
        role: 'combobox',
        'aria-haspopup': 'listbox',
        'aria-owns': elementIdsRef.current.menuId,
        'aria-expanded': latest.current.state.isOpen,
        ...rest,
      }
    },
    [latest, setGetterPropCallInfo],
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
    getComboboxProps,
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
