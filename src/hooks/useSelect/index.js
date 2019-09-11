/* eslint-disable max-statements */
import {useReducer, useRef, useEffect} from 'react'
import keyboardKey from 'keyboard-key'
import {useId} from '@reach/auto-id'
import {
  getElementIds,
  getState,
  getItemIndex,
  getPropTypesValidator,
  itemToString as defaultItemToString,
  isAcceptedCharacterKey,
} from '../utils'
import setStatus from '../../set-a11y-status'
import {
  callAllEventHandlers,
  callAll,
  debounce,
  scrollIntoView as defaultScrollIntoView,
} from '../../utils'
import downshiftSelectReducer from './reducer'
import {
  getA11yStatusMessage as defaultGetA11yStatusMessage,
  getA11ySelectionMessage as defaultGetA11ySelectionMessage,
  getInitialState,
  propTypes,
  callOnChangeProps,
} from './utils'
import * as stateChangeTypes from './stateChangeTypes'

const validatePropTypes = getPropTypesValidator(useSelect, propTypes)
const defaultProps = {
  itemToString: defaultItemToString,
  stateReducer: (s, a) => a.changes,
  getA11yStatusMessage: defaultGetA11yStatusMessage,
  getA11ySelectionMessage: defaultGetA11ySelectionMessage,
  scrollIntoView: defaultScrollIntoView,
  environment:
    typeof window === 'undefined' /* istanbul ignore next (ssr) */
      ? {}
      : window,
}

let clearTimeout

useSelect.stateChangeTypes = stateChangeTypes

function useSelect(userProps = {}) {
  validatePropTypes(userProps)
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
    initialIsOpen,
    defaultIsOpen,
    stateReducer,
    scrollIntoView,
    environment,
  } = props
  // Initial state depending on controlled props.
  const initialState = getInitialState(props)

  // Reducer init.
  const [
    {isOpen, highlightedIndex, selectedItem, keysSoFar},
    dispatch,
  ] = useReducer((state, action) => {
    const changes = downshiftSelectReducer(state, action) // state after original reducer.
    const reducedState = stateReducer(state, {...action, changes}) // state after user reducer.

    callOnChangeProps(props, state, reducedState) // call onChange with state resulted.

    return getState(reducedState, props) // state is merged with controlled props.
  }, initialState)

  // IDs generation.
  const {labelId, getItemId, menuId, toggleButtonId} = getElementIds(
    useId,
    props,
  )

  /* Refs */
  const toggleButtonRef = useRef(null)
  const menuRef = useRef(null)
  const itemRefs = useRef()
  itemRefs.current = []
  const isInitialMount = useRef(true)
  const shouldScroll = useRef(true)

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
      }),
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
      }),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItem])
  /* Sets cleanup for the keysSoFar after 500ms. */
  useEffect(() => {
    // init the clean function here as we need access to dispatch.
    if (isInitialMount.current) {
      clearTimeout = debounce(() => {
        dispatch({
          type: stateChangeTypes.FunctionClearKeysSoFar,
          props,
        })
      }, 500)
    }
    if (!keysSoFar) {
      return
    }
    clearTimeout()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keysSoFar])
  /* Controls the focus on the menu or the toggle button. */
  useEffect(() => {
    // Don't focus menu on first render.
    if (isInitialMount.current) {
      // Unless it was initialised as open.
      if (initialIsOpen || defaultIsOpen || isOpen) {
        menuRef.current.focus()
      }
      return
    }
    // Focus menu on open.
    // istanbul ignore next
    if (isOpen) {
      menuRef.current.focus()
      // Focus toggleButton on close.
    } else if (environment.document.activeElement === menuRef.current) {
      toggleButtonRef.current.focus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])
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
  /* Make initial ref false. */
  useEffect(() => {
    isInitialMount.current = false
  }, [])

  /* Event handler functions */
  const menuKeyDownHandlers = {
    ArrowDown(event) {
      event.preventDefault()
      dispatch({
        type: stateChangeTypes.MenuKeyDownArrowDown,
        props,
        shiftKey: event.shiftKey,
      })
    },
    ArrowUp(event) {
      event.preventDefault()
      dispatch({
        type: stateChangeTypes.MenuKeyDownArrowUp,
        props,
        shiftKey: event.shiftKey,
      })
    },
    Home(event) {
      event.preventDefault()
      dispatch({
        type: stateChangeTypes.MenuKeyDownHome,
        props,
      })
    },
    End(event) {
      event.preventDefault()
      dispatch({
        type: stateChangeTypes.MenuKeyDownEnd,
        props,
      })
    },
    Escape() {
      dispatch({
        type: stateChangeTypes.MenuKeyDownEscape,
        props,
      })
    },
    Enter() {
      dispatch({
        type: stateChangeTypes.MenuKeyDownEnter,
        props,
      })
    },
    Tab(event) {
      // The exception that calls MenuBlur.
      // istanbul ignore next
      if (event.shiftKey) {
        dispatch({
          type: stateChangeTypes.MenuBlur,
          props,
        })
      }
    },
  }
  const toggleButtonKeyDownHandlers = {
    ArrowDown(event) {
      event.preventDefault()
      dispatch({
        type: stateChangeTypes.ToggleButtonKeyDownArrowDown,
        props,
      })
    },
    ArrowUp(event) {
      event.preventDefault()
      dispatch({
        type: stateChangeTypes.ToggleButtonKeyDownArrowUp,
        props,
      })
    },
  }

  // Event handlers.
  const menuHandleKeyDown = event => {
    const key = keyboardKey.getKey(event)
    if (key && menuKeyDownHandlers[key]) {
      menuKeyDownHandlers[key](event)
    } else if (isAcceptedCharacterKey(key)) {
      dispatch({
        type: stateChangeTypes.MenuKeyDownCharacter,
        key,
        props,
      })
    }
  }
  // Focus going back to the toggleButton is something we control (Escape, Enter, Click).
  // We are toggleing special actions for these cases in reducer, not MenuBlur.
  // Since Shift-Tab also lands focus on toggleButton, we will handle it as exception and call MenuBlur.
  const menuHandleBlur = event => {
    if (event.relatedTarget !== toggleButtonRef.current) {
      dispatch({
        type: stateChangeTypes.MenuBlur,
        props,
      })
    }
  }
  const toggleButtonHandleClick = () => {
    dispatch({
      type: stateChangeTypes.ToggleButtonClick,
      props,
    })
  }
  const toggleButtonHandleKeyDown = event => {
    const key = keyboardKey.getKey(event)
    if (key && toggleButtonKeyDownHandlers[key]) {
      toggleButtonKeyDownHandlers[key](event)
    } else if (isAcceptedCharacterKey(key)) {
      dispatch({
        type: stateChangeTypes.ToggleButtonKeyDownCharacter,
        key,
        props,
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
      props,
      index,
    })
  }
  const itemHandleClick = index => {
    dispatch({
      type: stateChangeTypes.ItemClick,
      props,
      index,
    })
  }

  // returns
  const toggleMenu = () => {
    dispatch({
      type: stateChangeTypes.FunctionToggleMenu,
      props,
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
      props,
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
      props,
    })
  }
  const getLabelProps = labelProps => ({
    id: labelId,
    ...labelProps,
  })
  const getMenuProps = ({
    onKeyDown,
    onBlur,
    refKey = 'ref',
    ref,
    ...rest
  } = {}) => ({
    [refKey]: callAll(ref, menuNode => {
      menuRef.current = menuNode
    }),
    id: menuId,
    role: 'listbox',
    'aria-labelledby': labelId,
    tabIndex: -1,
    ...(highlightedIndex > -1 && {
      'aria-activedescendant': getItemId(highlightedIndex),
    }),
    onKeyDown: callAllEventHandlers(onKeyDown, menuHandleKeyDown),
    onBlur: callAllEventHandlers(onBlur, menuHandleBlur),
    ...rest,
  })
  const getToggleButtonProps = ({
    onClick,
    onKeyDown,
    refKey = 'ref',
    ref,
    ...rest
  } = {}) => ({
    [refKey]: callAll(ref, toggleButtonNode => {
      toggleButtonRef.current = toggleButtonNode
    }),
    id: toggleButtonId,
    'aria-haspopup': 'listbox',
    'aria-expanded': isOpen,
    'aria-labelledby': `${labelId} ${toggleButtonId}`,
    onClick: callAllEventHandlers(onClick, toggleButtonHandleClick),
    onKeyDown: callAllEventHandlers(onKeyDown, toggleButtonHandleKeyDown),
    ...rest,
  })
  const getItemProps = ({
    item,
    index,
    refKey = 'ref',
    ref,
    onMouseMove,
    onClick,
    ...rest
  } = {}) => {
    const itemIndex = getItemIndex(index, item, items)
    if (itemIndex < 0) {
      throw new Error('Pass either item or item index in getItemProps!')
    }
    return {
      [refKey]: callAll(ref, itemNode => {
        if (itemNode) {
          itemRefs.current.push(itemNode)
        }
      }),
      role: 'option',
      ...(itemIndex === highlightedIndex && {'aria-selected': true}),
      id: getItemId(itemIndex),
      onMouseMove: callAllEventHandlers(onMouseMove, () =>
        itemHandleMouseMove(itemIndex),
      ),
      onClick: callAllEventHandlers(onClick, () => itemHandleClick(itemIndex)),
      ...rest,
    }
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
    // state.
    highlightedIndex,
    isOpen,
    selectedItem,
  }
}

export default useSelect
