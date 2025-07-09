import {useCallback} from 'react'

import {useLatestRef} from '../../utils-ts'
import {
  useElementIds,
  defaultProps,
  validatePropTypes,
  useControlledReducer,
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

export default function useTagGroup(
  userProps: Partial<UseTagGroupProps> = {},
): UseTagGroupReturnValue {
  validatePropTypes(userProps, useTagGroup)
  // Props defaults and destructuring.
  const props = {
    ...defaultProps,
    ...userProps,
  }
  const [state, dispatch] = useControlledReducer<
    UseTagGroupState,
    UseTagGroupProps,
    UseTagGroupStateChangeTypes,
    UseTagGroupReducerAction
  >(
    useTagGroupReducer,
    props,
    () => ({activeIndex: -1, items: []}),
    (oldState, newState) => oldState.activeIndex === newState.activeIndex,
  )
  // utility callback to get item element.
  const latest = useLatestRef({state, props})

  // prevent id re-generation between renders.
  const elementIds = useElementIds(props)

  // Getter functions.
  const getTagGroupProps = useCallback(
    (options?: GetTagGroupPropsOptions & unknown) => {
      const onKeyDown = (e: React.KeyboardEvent): void => {
        if (e.key === 'ArrowLeft') {
          dispatch({type: UseTagGroupStateChangeTypes.TagGroupKeyDownArrowLeft})
        } else if (e.key === 'ArrowRight') {
          dispatch({
            type: UseTagGroupStateChangeTypes.TagGroupKeyDownArrowRight,
          })
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
    ({index, ...rest}: GetTagPropsOptions): GetTagPropsReturnValue => {
      if (index === undefined) {
        throw new Error('Pass index to getTagProps!')
      }

      const latestState = latest.current.state

      const onClick = () => {
        dispatch({type: UseTagGroupStateChangeTypes.TagClick, index})
      }

      return {
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

      const tagId = elementIds.getItemId(index)
      const id = `${tagId}-remove`

      return {
        id,
        tabIndex: -1,
        'aria-labelledby': `${id} ${tagId}`,
        ...rest,
      }
    },
    [elementIds],
  ) as GetTagRemoveProps

  return {
    getTagGroupProps,
    getTagProps,
    getTagRemoveProps,
  }
}
