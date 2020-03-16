import {useRef, useEffect} from 'react'
import {handleRefs, callAllEventHandlers, normalizeArrowKey} from '../../utils'
import {useEnhancedReducer, getItemIndex} from '../utils'
import {
  getInitialState,
  defaultProps,
  isKeyDownOperationPermitted,
} from './utils'
import downshiftMultipleSelectionReducer from './reducer'
import * as stateChangeTypes from './stateChangeTypes'

function useMultipleSelection(userProps = {}) {
  // Props defaults and destructuring.
  const props = {
    ...defaultProps,
    ...userProps,
  }

  // Reducer init.
  const [{activeIndex, items}, dispatch] = useEnhancedReducer(
    downshiftMultipleSelectionReducer,
    getInitialState(props),
    props,
  )

  // Refs.
  const isInitialMount = useRef(true)
  const dropdownRef = useRef(null)
  const itemRefs = useRef()
  itemRefs.current = []

  // Effects.
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
    ...rest
  } = {}) => ({
    [refKey]: handleRefs(ref, dropdownNode => {
      if (dropdownNode) {
        dropdownRef.current = dropdownNode
      }
    }),
    onKeyDown: callAllEventHandlers(onKeyDown, dropdownHandleKeyDown),
    ...rest,
  })

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

  return {
    getItemProps,
    getDropdownProps,
    addItem,
    removeItem,
    items,
    activeIndex,
  }
}

export default useMultipleSelection
