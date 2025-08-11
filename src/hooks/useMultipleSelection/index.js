import {useRef, useEffect, useCallback, useMemo} from 'react'
import {handleRefs, callAllEventHandlers, normalizeArrowKey} from '../../utils'
import {useLatestRef} from '../../utils-ts'
import {useGetterPropsCalledChecker, useControlPropsValidator} from '../utils'
import {
  useControlledReducer,
  useIsInitialMount,
  useA11yMessageStatus,
  getItemAndIndex,
} from '../utils-ts'
import {
  getInitialState,
  defaultProps,
  isKeyDownOperationPermitted,
  validatePropTypes,
  isStateEqual,
} from './utils'
import downshiftMultipleSelectionReducer from './reducer'
import * as stateChangeTypes from './stateChangeTypes'

useMultipleSelection.stateChangeTypes = stateChangeTypes

function useMultipleSelection(userProps = {}) {
  validatePropTypes(userProps, useMultipleSelection)
  // Props defaults and destructuring.
  const props = {
    ...defaultProps,
    ...userProps,
  }
  const {
    getA11yStatusMessage,
    environment,
    keyNavigationNext,
    keyNavigationPrevious,
  } = props

  // Reducer init.
  const [state, dispatch] = useControlledReducer(
    downshiftMultipleSelectionReducer,
    props,
    getInitialState,
    isStateEqual,
  )
  const {activeIndex, selectedItems} = state

  // Refs.
  const isInitialMount = useIsInitialMount()
  const dropdownRef = useRef(null)
  const selectedItemRefs = useRef()
  selectedItemRefs.current = []
  const latest = useLatestRef({state, props})

  // Effects.
  // Adds an a11y aria live status message if getA11yStatusMessage is passed.
  useA11yMessageStatus(
    getA11yStatusMessage,
    state,
    [activeIndex, selectedItems],
    environment,
  )
  // Sets focus on active item.
  useEffect(() => {
    if (isInitialMount) {
      return
    }

    if (activeIndex === -1 && dropdownRef.current) {
      dropdownRef.current.focus()
    } else if (selectedItemRefs.current[activeIndex]) {
      selectedItemRefs.current[activeIndex].focus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex])
  useControlPropsValidator({
    props,
    state,
  })
  const setGetterPropCallInfo = useGetterPropsCalledChecker('getDropdownProps')

  // Event handler functions.
  const selectedItemKeyDownHandlers = useMemo(
    () => ({
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
    }),
    [dispatch, keyNavigationNext, keyNavigationPrevious],
  )
  const dropdownKeyDownHandlers = useMemo(
    () => ({
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
    }),
    [dispatch, keyNavigationPrevious],
  )

  // Getter props.
  const getSelectedItemProps = useCallback(
    ({
      refKey = 'ref',
      ref,
      onClick,
      onKeyDown,
      selectedItem: selectedItemProp,
      index: indexProp,
      ...rest
    } = {}) => {
      const {state: latestState} = latest.current
      const [, index] = getItemAndIndex(
        selectedItemProp,
        indexProp,
        latestState.selectedItems,
        'Pass either item or index to getSelectedItemProps!',
      )
      const isFocusable = index > -1 && index === latestState.activeIndex

      const selectedItemHandleClick = () => {
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

      return {
        [refKey]: handleRefs(ref, selectedItemNode => {
          if (selectedItemNode) {
            selectedItemRefs.current.push(selectedItemNode)
          }
        }),
        tabIndex: isFocusable ? 0 : -1,
        onClick: callAllEventHandlers(onClick, selectedItemHandleClick),
        onKeyDown: callAllEventHandlers(onKeyDown, selectedItemHandleKeyDown),
        ...rest,
      }
    },
    [dispatch, latest, selectedItemKeyDownHandlers],
  )
  const getDropdownProps = useCallback(
    (
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
      setGetterPropCallInfo(
        'getDropdownProps',
        suppressRefError,
        refKey,
        dropdownRef,
      )

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
    },
    [dispatch, dropdownKeyDownHandlers, setGetterPropCallInfo],
  )

  // returns
  const addSelectedItem = useCallback(
    selectedItem => {
      dispatch({
        type: stateChangeTypes.FunctionAddSelectedItem,
        selectedItem,
      })
    },
    [dispatch],
  )
  const removeSelectedItem = useCallback(
    selectedItem => {
      dispatch({
        type: stateChangeTypes.FunctionRemoveSelectedItem,
        selectedItem,
      })
    },
    [dispatch],
  )
  const setSelectedItems = useCallback(
    newSelectedItems => {
      dispatch({
        type: stateChangeTypes.FunctionSetSelectedItems,
        selectedItems: newSelectedItems,
      })
    },
    [dispatch],
  )
  const setActiveIndex = useCallback(
    newActiveIndex => {
      dispatch({
        type: stateChangeTypes.FunctionSetActiveIndex,
        activeIndex: newActiveIndex,
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
