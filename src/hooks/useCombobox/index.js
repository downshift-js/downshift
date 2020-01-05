/* eslint-disable max-statements */
import {useRef, useEffect} from 'react'
import {isPreact, isReactNative} from '../../is.macro'
import setStatus from '../../set-a11y-status'
import {handleRefs, normalizeArrowKey, callAllEventHandlers} from '../../utils'
import {
  getItemIndex,
  useId,
  getPropTypesValidator,
  useEnhancedReducer,
  focusLandsOnElement,
} from '../utils'
import {getElementIds, getInitialState, propTypes, defaultProps} from './utils'
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
    getA11ySelectionMessage,
    getA11yStatusMessage,
    itemToString,
    environment,
    getMemoizedItemHandlers,
  } = props
  // Initial state depending on controlled props.
  const initialState = getInitialState(props)

  // Reducer init.
  const [
    {isOpen, highlightedIndex, selectedItem, inputValue},
    dispatchWithoutProps,
  ] = useEnhancedReducer(downshiftUseComboboxReducer, initialState, props)
  const dispatch = action => dispatchWithoutProps({props, ...action})

  // IDs generation.
  const {labelId, getItemId, menuId, toggleButtonId, inputId} = getElementIds(
    useId,
    props,
  )

  /* Refs */
  const menuRef = useRef(null)
  const itemRefs = useRef()
  const inputRef = useRef(null)
  const toggleButtonRef = useRef(null)
  itemRefs.current = []
  const shouldScroll = useRef(true)
  const isInitialMount = useRef(true)

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
        inputValue,
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
        inputValue,
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
  const inputHandleChange = event => {
    dispatch({
      type: stateChangeTypes.InputChange,
      inputValue: isReactNative
        ? /* istanbul ignore next (react-native) */ event.nativeEvent.text
        : event.target.value,
    })
  }
  const inputHandleBlur = event => {
    /* istanbul ignore else (react-native) */
    if (
      !(
        toggleButtonRef.current &&
        focusLandsOnElement(event, toggleButtonRef.current)
      )
    ) {
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
  }

  // returns
  const getLabelProps = labelProps => ({
    id: labelId,
    htmlFor: inputId,
    ...labelProps,
  })
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
  const getItemPropsEventHandlers = (
    onMouseMove,
    onClick,
    onPress,
    itemIndex,
  ) => {
    /* istanbul ignore next (react-native) */
    const [onSelectKey, customClickHandler] = isReactNative
      ? ['onPress', onPress]
      : ['onClick', onClick]

    return {
      onMouseMove: callAllEventHandlers(onMouseMove, () => {
        itemHandleMouseMove(itemIndex)
      }),
      [onSelectKey]: callAllEventHandlers(customClickHandler, () => {
        itemHandleClick(itemIndex)
      }),
    }
  }
  const getItemProps = ({
    item,
    index,
    refKey = 'ref',
    ref,
    onMouseMove,
    onClick,
    onPress,
    disabled,
    ...rest
  } = {}) => {
    const itemIndex = getItemIndex(index, item, items)

    if (itemIndex < 0) {
      throw new Error('Pass either item or item index in getItemProps!')
    }

    return {
      [refKey]: handleRefs(ref, itemNode => {
        if (itemNode) {
          itemRefs.current.push(itemNode)
        }
      }),
      role: 'option',
      ...(itemIndex === highlightedIndex && {'aria-selected': true}),
      id: getItemId(itemIndex),
      ...(!disabled &&
        (getMemoizedItemHandlers
          ? getMemoizedItemHandlers(
              () =>
                getItemPropsEventHandlers(
                  itemIndex,
                  onMouseMove,
                  onClick,
                  onPress,
                ),
              item,
              itemIndex,
            )
          : getItemPropsEventHandlers(
              onMouseMove,
              onClick,
              onPress,
              itemIndex,
            ))),
      ...rest,
    }
  }
  const getToggleButtonProps = ({
    onClick,
    onPress,
    refKey = 'ref',
    ref,
    disabled,
    ...rest
  } = {}) => {
    return {
      [refKey]: handleRefs(ref, toggleButtonNode => {
        toggleButtonRef.current = toggleButtonNode
      }),
      id: toggleButtonId,
      tabIndex: -1,
      ...(!disabled && {
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
  const getComboboxProps = ({...rest} = {}) => ({
    role: 'combobox',
    'aria-haspopup': 'listbox',
    'aria-owns': menuId,
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
