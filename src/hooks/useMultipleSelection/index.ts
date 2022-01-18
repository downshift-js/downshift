import {
  useRef,
  useEffect,
  useCallback,
  useMemo,
  MouseEventHandler,
  KeyboardEventHandler,
} from 'react'
import setStatus from '../../set-a11y-status'
import {handleRefs, callAllEventHandlers, normalizeArrowKey} from '../../utils'
import {
  useControlledReducer,
  getItemIndex,
  useGetterPropsCalledChecker,
  useLatestRef,
  useControlPropsValidator,
} from '../utils'
import {
  getInitialState,
  defaultProps,
  isKeyDownOperationPermitted,
  validatePropTypes,
} from './utils'
import downshiftMultipleSelectionReducer from './reducer'
import * as stateChangeTypes from './stateChangeTypes'
import {
  UseMultipleSelectionDispatch,
  UseMultipleSelectionGetDropdownPropsOptions,
  UseMultipleSelectionGetSelectedItemPropsOptions,
  UseMultipleSelectionProps,
  UseMultipleSelectionState,
} from './types'

useMultipleSelection.stateChangeTypes = stateChangeTypes

function useMultipleSelection<Item>(
  userProps: UseMultipleSelectionProps<Item> = {},
) {
  validatePropTypes(userProps, useMultipleSelection)
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
  ) as [UseMultipleSelectionState<Item>, UseMultipleSelectionDispatch<Item>]
  const {activeIndex, selectedItems} = state

  // Refs.
  const isInitialMountRef = useRef(true)
  const dropdownRef = useRef<HTMLElement | null>(null)
  const previousSelectedItemsRef = useRef(selectedItems)
  const selectedItemRefs = useRef<HTMLElement[]>([])
  selectedItemRefs.current = []
  const latest = useLatestRef({state, props})

  // Effects.
  /* Sets a11y status message on changes in selectedItem. */
  useEffect(() => {
    if (isInitialMountRef.current) {
      return
    }

    if (selectedItems.length < previousSelectedItemsRef.current.length) {
      const removedSelectedItem = previousSelectedItemsRef.current.find(
        item => !selectedItems.includes(item),
      ) as Item

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
      selectedItemRefs.current[activeIndex]?.focus()
    }
  }, [activeIndex])
  useControlPropsValidator({
    isInitialMount: isInitialMountRef.current,
    props,
    state,
  })
  const setGetterPropCallInfo = useGetterPropsCalledChecker('getDropdownProps')
  // Make initial ref false.
  useEffect(() => {
    isInitialMountRef.current = false
  }, [])

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
      [keyNavigationPrevious](event: KeyboardEvent) {
        if (isKeyDownOperationPermitted(event)) {
          dispatch({
            type: stateChangeTypes.DropdownKeyDownNavigationPrevious,
          })
        }
      },
      Backspace(event: KeyboardEvent) {
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
      selectedItem,
      index,
      ...rest
    }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
    UseMultipleSelectionGetSelectedItemPropsOptions<Item>): any => {
      const {state: latestState} = latest.current
      const itemIndex = getItemIndex(
        index,
        selectedItem,
        latestState.selectedItems,
      ) as number
      if (itemIndex < 0) {
        throw new Error(
          'Pass either selectedItem or index in getSelectedItemProps!',
        )
      }

      const selectedItemHandleClick = () => {
        dispatch({
          type: stateChangeTypes.SelectedItemClick,
          index: itemIndex,
        })
      }
      const selectedItemHandleKeyDown = (event: KeyboardEvent) => {
        const key = normalizeArrowKey(event)
        const handler = selectedItemKeyDownHandlers[key]

        if (handler) {
          handler()
        }
      }

      return {
        [refKey]: handleRefs(
          ref,
          (selectedItemNode?: HTMLElement | null | undefined) => {
            if (selectedItemNode) {
              selectedItemRefs.current.push(selectedItemNode)
            }
          },
        ),
        tabIndex: index === latestState.activeIndex ? 0 : -1,
        onClick: callAllEventHandlers(
          onClick,
          selectedItemHandleClick,
        ) as MouseEventHandler,
        onKeyDown: callAllEventHandlers(
          onKeyDown,
          selectedItemHandleKeyDown,
        ) as KeyboardEventHandler,
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
      }: UseMultipleSelectionGetDropdownPropsOptions = {},
      {suppressRefError = false} = {},
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): any => {
      setGetterPropCallInfo(
        'getDropdownProps',
        suppressRefError,
        refKey,
        dropdownRef,
      )

      const dropdownHandleKeyDown = (event: KeyboardEvent) => {
        const key = normalizeArrowKey(event)
        const handler = dropdownKeyDownHandlers[key]

        if (handler) {
          handler(event)
        }
      }
      const dropdownHandleClick = () => {
        dispatch({
          type: stateChangeTypes.DropdownClick,
        })
      }

      return {
        [refKey]: handleRefs(
          ref,
          (dropdownNode?: HTMLElement | null | undefined) => {
            if (dropdownNode) {
              dropdownRef.current = dropdownNode
            }
          },
        ),
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
    (selectedItem: Item) => {
      dispatch({
        type: stateChangeTypes.FunctionAddSelectedItem,
        selectedItem,
      })
    },
    [dispatch],
  )
  const removeSelectedItem = useCallback(
    (selectedItem: Item) => {
      dispatch({
        type: stateChangeTypes.FunctionRemoveSelectedItem,
        selectedItem,
      })
    },
    [dispatch],
  )
  const setSelectedItems = useCallback(
    (newSelectedItems: Item[]) => {
      dispatch({
        type: stateChangeTypes.FunctionSetSelectedItems,
        selectedItems: newSelectedItems,
      })
    },
    [dispatch],
  )
  const setActiveIndex = useCallback(
    (newActiveIndex: number) => {
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
