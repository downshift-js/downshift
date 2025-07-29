import {useEffect, useCallback, useRef} from 'react'

import {callAllEventHandlers, handleRefs, useLatestRef} from '../../utils-ts'
import {useIsInitialMount} from '../utils-ts'
// @ts-expect-error: can't import it otherwise.
import {isReactNative} from '../../is.macro'
import {
  useElementIds,
  validatePropTypes,
  useControlledReducer,
  getInitialState,
  isTagGroupStateEqual,
} from './utils'
import * as stateChangeTypes from './stateChangeTypes'
import {
  GetTagGroupProps,
  GetTagGroupPropsOptions,
  GetTagProps,
  GetTagPropsOptions,
  GetTagRemoveProps,
  GetTagRemovePropsOptions,
  UseTagGroupProps,
  UseTagGroupReducerAction,
  UseTagGroupReturnValue,
  UseTagGroupState,
  UseTagGroupStateChangeTypes,
} from './index.types'
import {useTagGroupReducer} from './reducer'

useTagGroup.stateChangeTypes = stateChangeTypes

export default function useTagGroup<Item>(
  userProps: Partial<UseTagGroupProps<Item>> = {},
): UseTagGroupReturnValue<Item> {
  validatePropTypes(userProps, useTagGroup)
  // Props defaults and destructuring.
  const defaultProps: Pick<
    UseTagGroupProps<Item>,
    'stateReducer' | 'environment'
  > = {
    stateReducer(_s, {changes}) {
      return changes
    },
    environment:
      /* istanbul ignore next (ssr) */
      typeof window === 'undefined' || isReactNative ? undefined : window,
  }
  const props = {
    ...defaultProps,
    ...userProps,
  }
  const [state, dispatch] = useControlledReducer<
    UseTagGroupState<Item>,
    UseTagGroupProps<Item>,
    UseTagGroupStateChangeTypes,
    UseTagGroupReducerAction<Item>
  >(useTagGroupReducer, props, getInitialState, isTagGroupStateEqual)
  const {activeIndex, items} = state
  // utility callback to get item element.
  const latest = useLatestRef({state, props})
  // prevent id re-generation between renders.
  const elementIds = useElementIds(props)
  const itemRefs = useRef<Record<string, HTMLElement>>({})
  const previousItemsLengthRef = useRef(items.length)
  const isInitialMount = useIsInitialMount()

  useEffect(() => {
    if (isInitialMount) {
      return
    }

    if (previousItemsLengthRef.current < items.length) {
      return
    }

    if (
      activeIndex >= 0 &&
      activeIndex < Object.keys(itemRefs.current).length
    ) {
      itemRefs.current[elementIds.getTagId(activeIndex)]?.focus()
    }
  }, [activeIndex, elementIds, isInitialMount, items.length])

  useEffect(() => {
    previousItemsLengthRef.current = items.length
  })

  // Getter functions.
  const getTagGroupProps = useCallback(
    ({onKeyDown, ...rest}: GetTagGroupPropsOptions & unknown = {}) => {
      const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>): void => {
        switch (e.key) {
          case 'ArrowLeft':
            dispatch({
              type: UseTagGroupStateChangeTypes.TagGroupKeyDownArrowLeft,
            })
            break
          case 'ArrowRight':
            dispatch({
              type: UseTagGroupStateChangeTypes.TagGroupKeyDownArrowRight,
            })
            break
          case 'Delete':
            dispatch({
              type: UseTagGroupStateChangeTypes.TagGroupKeyDownDelete,
            })
            break
          case 'Backspace':
            dispatch({
              type: UseTagGroupStateChangeTypes.TagGroupKeyDownBackspace,
            })
            break
          default:
        }
      }

      const tagGroupProps = {
        id: elementIds.tagGroupId,
        'aria-live': 'polite',
        'aria-atomic': 'false',
        'aria-relevant': 'additions',
        role: 'grid',
        onKeyDown: callAllEventHandlers(onKeyDown, handleKeyDown),
        ...rest,
      }

      return tagGroupProps
    },
    [dispatch, elementIds.tagGroupId],
  ) as GetTagGroupProps

  const getTagProps = useCallback(
    ({index, onClick, refKey = 'ref', ref, ...rest}: GetTagPropsOptions) => {
      if (index === undefined) {
        throw new Error('Pass index to getTagProps!')
      }

      const latestState = latest.current.state

      const handleClick = () => {
        dispatch({type: UseTagGroupStateChangeTypes.TagClick, index})
      }
      const id = elementIds.getTagId(index)

      return {
        [refKey]: handleRefs(ref, itemNode => {
          if (itemNode) {
            itemRefs.current[elementIds.getTagId(index)] = itemNode
          }
        }),
        role: 'row',
        id,
        onClick: callAllEventHandlers(onClick, handleClick),
        tabIndex: latestState.activeIndex === index ? 0 : -1,
        ...rest,
      }
    },
    [dispatch, elementIds, latest],
  ) as GetTagProps

  const getTagRemoveProps = useCallback(
    ({index, onClick, ...rest}: GetTagRemovePropsOptions) => {
      if (index === undefined) {
        throw new Error('Pass index to getTagRemoveProps!')
      }

      const handleClick = (event: React.MouseEvent) => {
        event.stopPropagation()
        dispatch({type: UseTagGroupStateChangeTypes.TagRemoveClick, index})
      }

      const tagId = elementIds.getTagId(index)
      const id = `${tagId}-remove`

      return {
        id,
        tabIndex: -1,
        'aria-labelledby': `${elementIds.tagGroupId} ${tagId}`,
        onClick: callAllEventHandlers(onClick, handleClick),
        ...rest,
      }
    },
    [elementIds, dispatch],
  ) as GetTagRemoveProps

  const addItem = useCallback<UseTagGroupReturnValue<Item>['addItem']>(
    (item, index): void => {
      dispatch({type: UseTagGroupStateChangeTypes.FunctionAddItem, item, index})
    },
    [dispatch],
  )

  return {
    activeIndex,
    addItem,
    getTagGroupProps,
    getTagProps,
    getTagRemoveProps,
    items,
  }
}
