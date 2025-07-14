import {useEffect, useCallback, useRef} from 'react'

import {handleRefs, useLatestRef} from '../../utils-ts'
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
  GetTagGroupPropsReturnValue,
  GetTagProps,
  GetTagPropsOptions,
  GetTagPropsReturnValue,
  GetTagRemoveProps,
  GetTagRemovePropsOptions,
  GetTagRemovePropsReturnValue,
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
  console.log(isReactNative)
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
  const isInitialMount = useIsInitialMount()

  useEffect(() => {
    if (isInitialMount) {
      return
    }
    if (activeIndex >= 0 && activeIndex < items.length && props.environment) {
      itemRefs.current[elementIds.getItemId(activeIndex)]?.focus()
    }
  }, [activeIndex, elementIds, isInitialMount, items.length, props.environment])

  // Getter functions.
  const getTagGroupProps = useCallback(
    (options?: GetTagGroupPropsOptions & unknown) => {
      const onKeyDown = (e: React.KeyboardEvent): void => {
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

      const tagGroupProps: GetTagGroupPropsReturnValue = {
        role: 'grid',
        onKeyDown,
        ...(options ?? {}),
      }

      return tagGroupProps
    },
    [dispatch],
  ) as GetTagGroupProps

  const getTagProps = useCallback(
    ({
      index,
      refKey = 'ref',
      ref,
      ...rest
    }: GetTagPropsOptions): GetTagPropsReturnValue => {
      if (index === undefined) {
        throw new Error('Pass index to getTagProps!')
      }

      const latestState = latest.current.state

      const onClick = () => {
        dispatch({type: UseTagGroupStateChangeTypes.TagClick, index})
      }

      return {
        [refKey]: handleRefs(ref, itemNode => {
          if (itemNode) {
            itemRefs.current[elementIds.getItemId(index)] = itemNode
          }
        }),
        role: 'row',
        id: elementIds.getItemId(index),
        onClick,
        tabIndex: latestState.activeIndex === index ? 0 : -1,
        ...rest,
      }
    },
    [dispatch, elementIds, latest],
  ) as GetTagProps

  const getTagRemoveProps = useCallback(
    ({
      index,
      ...rest
    }: GetTagRemovePropsOptions): GetTagRemovePropsReturnValue => {
      if (index === undefined) {
        throw new Error('Pass index to getTagRemoveProps!')
      }

      const onClick = (event: React.MouseEvent) => {
        event.stopPropagation()
        dispatch({type: UseTagGroupStateChangeTypes.TagRemoveClick, index})
      }

      const tagId = elementIds.getItemId(index)
      const id = `${tagId}-remove`

      return {
        id,
        tabIndex: -1,
        'aria-labelledby': `${id} ${tagId}`,
        onClick,
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
