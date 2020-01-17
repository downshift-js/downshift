/* eslint-disable max-statements */
import {useRef, useEffect} from 'react'
import {isPreact, isReactNative} from '../../is.macro'
import setStatus from '../../set-a11y-status'
import {
  handleRefs,
  normalizeArrowKey,
  callAllEventHandlers,
  targetWithinDownshift,
  debounce,
} from '../../utils'
import {
  useId,
  getPropTypesValidator,
  useEnhancedReducer,
  focusLandsOnElement,
  isAcceptedCharacterKey,
  getItemIndex,
} from '../utils'
import {getElementIds, getInitialState, propTypes, defaultProps} from './utils'
import dropdownReducer from './reducer'
import * as stateChangeTypes from './stateChangeTypes'

const validatePropTypes =
  process.env.NODE_ENV === 'production'
    ? /* istanbul ignore next */ null
    : getPropTypesValidator(useDropdown, propTypes)

useDropdown.stateChangeTypes = stateChangeTypes

function useDropdown(userProps = {}) {
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
    initialIsOpen,
    defaultIsOpen,
    scrollIntoView,
    getA11ySelectionMessage,
    getA11yStatusMessage,
    itemToString,
    environment,
  } = props
  // Initial state depending on controlled props.
  const initialState = getInitialState(props)

  // Reducer init.
  const [
    {isOpen, highlightedIndex, selectedItem, inputValue},
    dispatchWithoutProps,
  ] = useEnhancedReducer(dropdownReducer, initialState, props)
  const dispatch = action => dispatchWithoutProps({props, ...action})

  // IDs generation.
  const {labelId, getItemId, menuId, toggleButtonId, inputId} = getElementIds(
    useId,
    props,
  )

  // Refs.
  const menuRef = useRef(null)
  const inputRef = useRef(null)
  const toggleButtonRef = useRef(null)
  const comboboxRef = useRef(null)
  const shouldScroll = useRef(true)
  const isInitialMount = useRef(true)
  const mouseAndTouchTrackers = useRef({
    isMouseDown: false,
    isTouchMove: false,
  })
  const clearTimeout = useRef(null)

  // Some utils.
  const getItemNodeFromIndex = index =>
    environment.document.getElementById(getItemId(index))
  const isCombobox = comboboxRef.current && inputRef.current

  // Effects.
  // Sets a11y status message on changes in isOpen.
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
        inputValue,
      }),
      environment.document,
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])
  // Sets a11y status message on changes in selectedItem.
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
        inputValue,
      }),
      environment.document,
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItem])
  // Sets cleanup for the input after 500ms if it's a select.
  useEffect(() => {
    if (isCombobox) {
      return
    }

    // init the clean function here as we need access to dispatch.
    if (isInitialMount.current) {
      clearTimeout.current = debounce(() => {
        dispatch({
          type: stateChangeTypes.FunctionSetInputValue,
          inputValue: '',
        })
      }, 500)
    }

    if (!inputValue) {
      return
    }

    clearTimeout.current()
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
  /* Controls the focus on the menu or the toggle button. */
  useEffect(() => {
    // If it's just a select, skip.
    if (!inputRef.current) {
      return
    }

    // Don't focus input on first render.
    if (isInitialMount.current) {
      // Unless it was initialised as open.
      if (initialIsOpen || defaultIsOpen || isOpen) {
        inputRef.current.focus()
      }
      return
    }

    // Focus menu on open.
    // istanbul ignore next
    if (isOpen) {
      inputRef.current.focus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])
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
          isCombobox ? comboboxRef.current : toggleButtonRef.current,
          menuRef.current,
          environment.document,
        )
      ) {
        dispatch({
          type: isCombobox
            ? stateChangeTypes.InputBlur
            : stateChangeTypes.ToggleButtonBlur,
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
          isCombobox ? comboboxRef.current : toggleButtonRef.current,
          menuRef.current,
          environment.document,
          false,
        )
      ) {
        dispatch({
          type: isCombobox
            ? stateChangeTypes.InputBlur
            : stateChangeTypes.ToggleButtonBlur,
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
        shiftKey: event.shiftKey,
        getItemNodeFromIndex,
      })
    },
    ArrowUp(event) {
      event.preventDefault()
      dispatch({
        type: stateChangeTypes.ToggleButtonKeyDownArrowUp,
        shiftKey: event.shiftKey,
        getItemNodeFromIndex,
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
      event.preventDefault()
      dispatch({
        type: stateChangeTypes.InputKeyDownEnter,
        getItemNodeFromIndex,
      })
    },
  }

  // Event handlers.
  const inputHandleKeyDown = event => {
    const key = normalizeArrowKey(event)
    if (key && inputKeyDownHandlers[key]) {
      inputKeyDownHandlers[key](event)
    }
  }
  const toggleButtonHandleKeyDown = event => {
    const key = normalizeArrowKey(event)
    if (key && toggleButtonKeyDownHandlers[key]) {
      toggleButtonKeyDownHandlers[key](event)
    } else if (!isCombobox && isAcceptedCharacterKey(key)) {
      dispatch({
        type: stateChangeTypes.ToggleButtonKeyDownCharacter,
        key,
        getItemNodeFromIndex,
      })
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
  const inputHandleBlur = event => {
    const shouldBlur = !(
      mouseAndTouchTrackers.current.isMouseDown ||
      focusLandsOnElement(event, toggleButtonRef.current)
    )
    /* istanbul ignore else */
    if (shouldBlur) {
      dispatch({
        type: stateChangeTypes.InputBlur,
      })
    }
  }
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
      isCombobox,
    })
  }
  const toggleButtonHandleClick = () => {
    dispatch({
      type: stateChangeTypes.ToggleButtonClick,
    })
  }

  // Getter functions.
  const getLabelProps = labelProps => {
    return {
      id: labelId,
      htmlFor: inputRef.current ? inputId : toggleButtonId,
      ...labelProps,
    }
  }
  const getMenuProps = ({onMouseLeave, refKey = 'ref', ref, ...rest} = {}) => ({
    [refKey]: handleRefs(ref, menuNode => {
      menuRef.current = menuNode
    }),
    id: menuId,
    role: 'listbox',
    'aria-labelledby': labelId,
    onMouseLeave: callAllEventHandlers(onMouseLeave, menuHandleMouseLeave),
    ...rest,
  })
  const getItemProps = ({
    item,
    index,
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
      role: 'option',
      ...(index === highlightedIndex && {'aria-selected': true}),
      id: getItemId(index),
      ...(!rest.disabled && {
        onMouseMove: callAllEventHandlers(onMouseMove, () => {
          itemHandleMouseMove(index)
        }),
        [onSelectKey]: callAllEventHandlers(customClickHandler, () => {
          itemHandleClick(index)
        }),
      }),
      ...rest,
    }
  }
  const getToggleButtonProps = ({
    onClick,
    onPress,
    onKeyDown,
    onBlur,
    refKey = 'ref',
    ref,
    ...rest
  } = {}) => {
    return {
      [refKey]: handleRefs(ref, toggleButtonNode => {
        toggleButtonRef.current = toggleButtonNode
      }),
      id: toggleButtonId,
      ...(isCombobox
        ? {
            tabIndex: -1,
          }
        : {
            'aria-labelledby': `${labelId} ${toggleButtonId}`,
            'aria-expanded': isOpen,
            'aria-controls': menuId,
            'aria-haspopup': 'listbox',
            ...(highlightedIndex > -1 && {
              'aria-activedescendant': getItemId(highlightedIndex),
            }),
            onBlur: callAllEventHandlers(onBlur, toggleButtonHandleBlur),
          }),
      onKeyDown: callAllEventHandlers(onKeyDown, toggleButtonHandleKeyDown),
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
      id: inputId,
      'aria-autocomplete': 'list',
      'aria-controls': menuId,
      ...(highlightedIndex > -1 && {
        'aria-activedescendant': getItemId(highlightedIndex),
      }),
      'aria-labelledby': labelId,
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
    'aria-owns': menuId,
    'aria-expanded': isOpen,
    ...rest,
  })

  // Actional helper functions.
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

export default useDropdown
