import {useRef, useEffect} from 'react'
import setStatus from '../../set-a11y-status'
import {handleRefs, callAllEventHandlers, normalizeArrowKey} from '../../utils'
import {useEnhancedReducer, getItemIndex} from '../utils'
import {
  getInitialState,
  defaultProps,
  isKeyDownOperationPermitted,
} from './utils'
import downshiftMultipleSelectionReducer from './reducer'
import * as stateChangeTypes from './stateChangeTypes'

useMultipleSelection.stateChangeTypes = stateChangeTypes

function useMultipleSelection(userProps = {}) {
  // Props defaults and destructuring.
  const props = {
    ...defaultProps,
    ...userProps,
  }
  const {getA11yRemovalMessage, itemToString, environment} = props

  // Reducer init.
  const [{activeIndex, items}, dispatch] = useEnhancedReducer(
    downshiftMultipleSelectionReducer,
    getInitialState(props),
    props,
  )

  // Refs.
  const isInitialMount = useRef(true)
  const dropdownRef = useRef(null)
  const previosItemsRef = useRef(items)
  const itemRefs = useRef()
  itemRefs.current = []

  // Effects.
  /* Sets a11y status message on changes in selectedItem. */
  useEffect(() => {
    if (isInitialMount.current) {
      return
    }

    if (items.length < previosItemsRef.current.length) {
      const removedItem = previosItemsRef.current.find(
        item => items.indexOf(item) < 0,
      )

      setStatus(
        getA11yRemovalMessage({
          itemToString,
          resultCount: items.length,
          removedItem,
          activeIndex,
          activeItem: items[activeIndex],
        }),
        environment.document,
      )
    }

    previosItemsRef.current = items

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length])
  // Sets focus on active item.
  useEffect(() => {
    if (isInitialMount.current) {
      return
    }

    if (activeIndex === -1 && dropdownRef.current) {
      dropdownRef.current.focus()
    } else if (itemRefs.current[activeIndex]) {
      itemRefs.current[activeIndex].focus()
    }
  }, [activeIndex])
  // Make initial ref false.
  useEffect(() => {
    isInitialMount.current = false
  }, [])

  // Event handler functions.
  const itemKeyDownHandlers = {
    ArrowLeft() {
      dispatch({
        type: stateChangeTypes.ItemKeyDownArrowLeft,
      })
    },
    ArrowRight() {
      dispatch({
        type: stateChangeTypes.ItemKeyDownArrowRight,
      })
    },
    Delete() {
      dispatch({
        type: stateChangeTypes.ItemKeyDownDelete,
      })
    },
    Backspace() {
      dispatch({
        type: stateChangeTypes.ItemKeyDownBackspace,
      })
    },
  }
  const dropdownKeyDownHandlers = {
    ArrowLeft(event) {
      if (isKeyDownOperationPermitted(event)) {
        dispatch({
          type: stateChangeTypes.DropdownKeyDownArrowLeft,
        })
      }
    },
    Backspace(event) {
      if (isKeyDownOperationPermitted(event)) {
        dispatch({
          type: stateChangeTypes.DropdownKeyDownBackspace,
        })
      }
    },
  }

  // Event handlers.
  const itemHandleClick = index => {
    dispatch({
      type: stateChangeTypes.ItemClick,
      index,
    })
  }
  const itemHandleKeyDown = event => {
    const key = normalizeArrowKey(event)
    if (key && itemKeyDownHandlers[key]) {
      itemKeyDownHandlers[key](event)
    }
  }
  const dropdownHandleKeyDown = event => {
    const key = normalizeArrowKey(event)
    if (key && dropdownKeyDownHandlers[key]) {
      dropdownKeyDownHandlers[key](event)
    }
  }
  const dropdownHandleClick = () => {
    dispatch({
      type: stateChangeTypes.DropdownClick,
    })
  }

  // Getter props.
  const getItemProps = ({
    refKey = 'ref',
    ref,
    onClick,
    onKeyDown,
    item,
    index,
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
      tabIndex: index === activeIndex ? 0 : -1,
      onClick: callAllEventHandlers(onClick, () => {
        itemHandleClick(index)
      }),
      onKeyDown: callAllEventHandlers(onKeyDown, itemHandleKeyDown),
      ...rest,
    }
  }
  const getDropdownProps = ({
    refKey = 'ref',
    ref,
    onKeyDown,
    onClick,
    isOpen,
    ...rest
  } = {}) => {
    if (isOpen === undefined) {
      throw new Error('Pass isOpen state variable in getDropdownProps!')
    }

    return {
      [refKey]: handleRefs(ref, dropdownNode => {
        if (dropdownNode) {
          dropdownRef.current = dropdownNode
        }
      }),
      ...(!isOpen && {
        onKeyDown: callAllEventHandlers(onKeyDown, dropdownHandleKeyDown),
        onClick: callAllEventHandlers(onClick, dropdownHandleClick),
      }),
      ...rest,
    }
  }

  // returns
  const addItem = item => {
    dispatch({
      type: stateChangeTypes.FunctionAddItem,
      item,
    })
  }
  const removeItem = item => {
    dispatch({
      type: stateChangeTypes.FunctionRemoveItem,
      item,
    })
  }
  const setItems = newItems => {
    dispatch({
      type: stateChangeTypes.FunctionSetItems,
      items: newItems,
    })
  }
  const setActiveIndex = newActiveIndex => {
    dispatch({
      type: stateChangeTypes.FunctionSetActiveIndex,
      activeIndex: newActiveIndex,
    })
  }
  const reset = () => {
    dispatch({
      type: stateChangeTypes.FunctionReset,
    })
  }

  return {
    getItemProps,
    getDropdownProps,
    addItem,
    removeItem,
    setItems,
    setActiveIndex,
    reset,
    items,
    activeIndex,
  }
}

export default useMultipleSelection
