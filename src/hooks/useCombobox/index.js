/* eslint-disable max-statements */
import {useRef, useEffect} from 'react'
import {isPreact, isReactNative} from '../../is.macro'
import {handleRefs, normalizeArrowKey, callAllEventHandlers} from '../../utils'
import {
  getItemIndex,
  getPropTypesValidator,
  updateA11yStatus,
  useMouseAndTouchTracker,
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

  // Reducer init.
  const [
    {isOpen, highlightedIndex, selectedItem, inputValue},
    dispatch,
  ] = useControlledReducer(downshiftUseComboboxReducer, initialState, props)

  /* Refs */
  const menuRef = useRef(null)
  const itemRefs = useRef()
  const inputRef = useRef(null)
  const toggleButtonRef = useRef(null)
  const comboboxRef = useRef(null)
  itemRefs.current = []
  const shouldScroll = useRef(true)
  const isInitialMount = useRef(true)
  const elementIds = useRef(getElementIds(props))
  const previousResultCountRef = useRef()

  /* Effects */
  /* Sets a11y status message on changes in state. */
  useEffect(() => {
    if (isInitialMount.current) {
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
    if (isInitialMount.current) {
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
  /* Controls the focus on the menu or the toggle button. */
  useEffect(() => {
    // Don't focus menu on first render.
    if (isInitialMount.current) {
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
    if (isInitialMount.current) {
      return
    }

    previousResultCountRef.current = items.length
  })
  useEffect(() => {
    isInitialMount.current = false
  }, [])
  /* Add mouse/touch events to document. */
  const isMouseDown = useMouseAndTouchTracker(
    isOpen,
    [comboboxRef, menuRef, toggleButtonRef],
    environment,
    () => {
      dispatch({
        type: stateChangeTypes.InputBlur,
      })
    },
  )

  const getItemNodeFromIndex = index => itemRefs.current[index]

  /* Event handler functions */
  const inputKeyDownHandlers = {
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

      if (isOpen && highlightedIndex > -1) {
        event.preventDefault()
        dispatch({
          type: stateChangeTypes.InputKeyDownEnter,
          getItemNodeFromIndex,
        })
      }
    },
  }

  // Event handlers.
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
    if (!isMouseDown) {
      dispatch({
        type: stateChangeTypes.InputBlur,
      })
    }
  }
  const menuHandleMouseLeave = () => {
    dispatch({
      type: stateChangeTypes.MenuMouseLeave,
    })
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
  const toggleButtonHandleClick = () => {
    dispatch({
      type: stateChangeTypes.ToggleButtonClick,
    })

    if (!isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }

  // Getter props.
  const getLabelProps = labelProps => ({
    id: elementIds.current.labelId,
    htmlFor: elementIds.current.inputId,
    ...labelProps,
  })
  const getMenuProps = ({onMouseLeave, refKey = 'ref', ref, ...rest} = {}) => ({
    [refKey]: handleRefs(ref, menuNode => {
      menuRef.current = menuNode
    }),
    id: elementIds.current.menuId,
    role: 'listbox',
    'aria-labelledby': elementIds.current.labelId,
    onMouseLeave: callAllEventHandlers(onMouseLeave, menuHandleMouseLeave),
    ...rest,
  })
  const getItemProps = ({
    item,
    index,
    refKey = 'ref',
    ref,
    onMouseMove,
    onClick,
    onPress,
    ...rest
  } = {}) => {
    const itemIndex = getItemIndex(index, item, items)
    if (itemIndex < 0) {
      throw new Error('Pass either item or item index in getItemProps!')
    }

    const onSelectKey = isReactNative
      ? /* istanbul ignore next (react-native) */ 'onPress'
      : 'onClick'
    const customClickHandler = isReactNative
      ? /* istanbul ignore next (react-native) */ onPress
      : onClick

    return {
      [refKey]: handleRefs(ref, itemNode => {
        if (itemNode) {
          itemRefs.current.push(itemNode)
        }
      }),
      role: 'option',
      'aria-selected': `${itemIndex === highlightedIndex}`,
      id: elementIds.current.getItemId(itemIndex),
      ...(!rest.disabled && {
        onMouseMove: callAllEventHandlers(onMouseMove, () => {
          itemHandleMouseMove(itemIndex)
        }),
        [onSelectKey]: callAllEventHandlers(customClickHandler, () => {
          itemHandleClick(itemIndex)
        }),
      }),
      ...rest,
    }
  }
  const getToggleButtonProps = ({
    onClick,
    onPress,
    refKey = 'ref',
    ref,
    ...rest
  } = {}) => {
    return {
      [refKey]: handleRefs(ref, toggleButtonNode => {
        toggleButtonRef.current = toggleButtonNode
      }),
      id: elementIds.current.toggleButtonId,
      tabIndex: -1,
      ...(!rest.disabled && {
        ...(isReactNative
          ? /* istanbul ignore next (react-native) */ {
              onPress: callAllEventHandlers(onPress, toggleButtonHandleClick),
            }
          : {onClick: callAllEventHandlers(onClick, toggleButtonHandleClick)}),
      }),
      ...rest,
    }
  }
  const getInputProps = ({
    onKeyDown,
    onChange,
    onInput,
    onBlur,
    onChangeText,
    refKey = 'ref',
    ref,
    ...rest
  } = {}) => {
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
      id: elementIds.current.inputId,
      'aria-autocomplete': 'list',
      'aria-controls': elementIds.current.menuId,
      ...(isOpen &&
        highlightedIndex > -1 && {
          'aria-activedescendant': elementIds.current.getItemId(
            highlightedIndex,
          ),
        }),
      'aria-labelledby': elementIds.current.labelId,
      // https://developer.mozilla.org/en-US/docs/Web/Security/Securing_your_site/Turning_off_form_autocompletion
      // revert back since autocomplete="nope" is ignored on latest Chrome and Opera
      autoComplete: 'off',
      value: inputValue,
      ...eventHandlers,
      ...rest,
    }
  }
  const getComboboxProps = ({refKey = 'ref', ref, ...rest} = {}) => ({
    [refKey]: handleRefs(ref, comboboxNode => {
      comboboxRef.current = comboboxNode
    }),
    role: 'combobox',
    'aria-haspopup': 'listbox',
    'aria-owns': elementIds.current.menuId,
    'aria-expanded': isOpen,
    ...rest,
  })

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
  const setInputValue = newInputValue => {
    dispatch({
      type: stateChangeTypes.FunctionSetInputValue,
      inputValue: newInputValue,
    })
  }
  const reset = () => {
    dispatch({
      type: stateChangeTypes.FunctionReset,
    })
  }

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
