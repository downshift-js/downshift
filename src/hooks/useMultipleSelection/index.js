import {useRef, useEffect} from 'react'
import setStatus from '../../set-a11y-status'
import {handleRefs, callAllEventHandlers, normalizeArrowKey, validateControlledUnchanged} from '../../utils'
import {
  useControlledReducer,
  getItemIndex,
  useGetterPropsCalledChecker,
} from '../utils'
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
  const {
    getA11yRemovalMessage,
    itemToString,
    environment,
    keyNavigationNext,
    keyNavigationPrevious,
  } = props

  // Reducer init.
  const [state, dispatch] = useControlledReducer(
    downshiftMultipleSelectionReducer,
    getInitialState(props),
    props,
  )
  const {activeIndex, selectedItems} = state

  // Refs.
  const isInitialMountRef = useRef(true)
  const dropdownRef = useRef(null)
  const previousSelectedItemsRef = useRef(selectedItems)
  const selectedItemRefs = useRef()
  selectedItemRefs.current = []
  // used to store information about getter props being called on render.
  const getterPropsCalledRef = useRef({
    getDropdownProps: {},
  })
  // used for checking when props are moving from controlled to uncontrolled.
  const prevPropsRef = useRef(props)

  // Effects.
  /* Sets a11y status message on changes in selectedItem. */
  useEffect(() => {
    if (isInitialMountRef.current) {
      return
    }

    if (selectedItems.length < previousSelectedItemsRef.current.length) {
      const removedSelectedItem = previousSelectedItemsRef.current.find(
        item => selectedItems.indexOf(item) < 0,
      )

      setStatus(
        getA11yRemovalMessage({
          itemToString,
          resultCount: selectedItems.length,
          removedSelectedItem,
          activeIndex,
          activeSelectedItem: selectedItems[activeIndex],
        }),
        environment.document,
      )
    }

    previousSelectedItemsRef.current = selectedItems

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItems.length])
  // Sets focus on active item.
  useEffect(() => {
    if (isInitialMountRef.current) {
      return
    }

    if (activeIndex === -1 && dropdownRef.current) {
      dropdownRef.current.focus()
    } else if (selectedItemRefs.current[activeIndex]) {
      selectedItemRefs.current[activeIndex].focus()
    }
  }, [activeIndex])
  useEffect(() => {
    if (isInitialMountRef.current) {
      return
    }

    validateControlledUnchanged(state, prevPropsRef.current, props)
    prevPropsRef.current = props
  }, [state, props])
  // Make initial ref false.
  useEffect(() => {
    isInitialMountRef.current = false
  }, [])
  useGetterPropsCalledChecker(getterPropsCalledRef)

  // Event handler functions.
  const selectedItemKeyDownHandlers = {
    [keyNavigationPrevious]() {
      dispatch({
        type: stateChangeTypes.SelectedItemKeyDownNavigationPrevious,
      })
    },
    [keyNavigationNext]() {
      dispatch({
        type: stateChangeTypes.SelectedItemKeyDownNavigationNext,
      })
    },
    Delete() {
      dispatch({
        type: stateChangeTypes.SelectedItemKeyDownDelete,
      })
    },
    Backspace() {
      dispatch({
        type: stateChangeTypes.SelectedItemKeyDownBackspace,
      })
    },
  }
  const dropdownKeyDownHandlers = {
    [keyNavigationPrevious](event) {
      if (isKeyDownOperationPermitted(event)) {
        dispatch({
          type: stateChangeTypes.DropdownKeyDownNavigationPrevious,
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
  const selectedItemHandleClick = index => {
    dispatch({
      type: stateChangeTypes.SelectedItemClick,
      index,
    })
  }
  const selectedItemHandleKeyDown = event => {
    const key = normalizeArrowKey(event)
    if (key && selectedItemKeyDownHandlers[key]) {
      selectedItemKeyDownHandlers[key](event)
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
  const getSelectedItemProps = ({
    refKey = 'ref',
    ref,
    onClick,
    onKeyDown,
    selectedItem,
    index,
    ...rest
  } = {}) => {
    const itemIndex = getItemIndex(index, selectedItem, selectedItems)
    if (itemIndex < 0) {
      throw new Error(
        'Pass either selectedItem or index in getSelectedItemProps!',
      )
    }

    return {
      [refKey]: handleRefs(ref, selectedItemNode => {
        if (selectedItemNode) {
          selectedItemRefs.current.push(selectedItemNode)
        }
      }),
      tabIndex: index === activeIndex ? 0 : -1,
      onClick: callAllEventHandlers(onClick, () => {
        selectedItemHandleClick(index)
      }),
      onKeyDown: callAllEventHandlers(onKeyDown, selectedItemHandleKeyDown),
      ...rest,
    }
  }
  const getDropdownProps = (
    {
      refKey = 'ref',
      ref,
      onKeyDown,
      onClick,
      preventKeyAction = false,
      ...rest
    } = {},
    {suppressRefError = false} = {},
  ) => {
    getterPropsCalledRef.current.getDropdownProps.called = true
    getterPropsCalledRef.current.getDropdownProps.suppressRefError = suppressRefError
    getterPropsCalledRef.current.getDropdownProps.refKey = refKey
    getterPropsCalledRef.current.getDropdownProps.elementRef = dropdownRef

    return {
      [refKey]: handleRefs(ref, dropdownNode => {
        if (dropdownNode) {
          dropdownRef.current = dropdownNode
        }
      }),
      ...(!preventKeyAction && {
        onKeyDown: callAllEventHandlers(onKeyDown, dropdownHandleKeyDown),
        onClick: callAllEventHandlers(onClick, dropdownHandleClick),
      }),
      ...rest,
    }
  }

  // returns
  const addSelectedItem = selectedItem => {
    dispatch({
      type: stateChangeTypes.FunctionAddSelectedItem,
      selectedItem,
    })
  }
  const removeSelectedItem = selectedItem => {
    dispatch({
      type: stateChangeTypes.FunctionRemoveSelectedItem,
      selectedItem,
    })
  }
  const setSelectedItems = newSelectedItems => {
    dispatch({
      type: stateChangeTypes.FunctionSetSelectedItems,
      selectedItems: newSelectedItems,
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
    getSelectedItemProps,
    getDropdownProps,
    addSelectedItem,
    removeSelectedItem,
    setSelectedItems,
    setActiveIndex,
    reset,
    selectedItems,
    activeIndex,
  }
}

export default useMultipleSelection
