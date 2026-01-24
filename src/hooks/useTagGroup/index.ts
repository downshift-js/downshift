import {useCallback} from 'react'

import {
  callAllEventHandlers,
  handleRefs,
  useLatestRef,
  validatePropTypes,
} from '../../utils-ts'
import {useControlledReducer} from '../utils-ts'
import * as stateChangeTypes from './stateChangeTypes'
import {
  GetTagGroupPropsOptions,
  GetTagPropsOptions,
  GetTagRemovePropsOptions,
  UseTagGroupInterface,
  UseTagGroupProps,
  UseTagGroupMergedProps,
  UseTagGroupReducerAction,
  UseTagGroupReturnValue,
  UseTagGroupState,
  UseTagGroupStateChangeTypes,
  GetTagRemovePropsReturnValue,
  GetTagPropsReturnValue,
  GetTagGroupPropsReturnValue,
} from './index.types'
import {useTagGroupReducer} from './reducer'
import {
  getInitialState,
  isStateEqual,
  propTypes,
  useElementIds,
  useAccessibleDescription,
  A11Y_DESCRIPTION_ELEMENT_ID,
  getMergedProps,
  useRovingTagFocus,
} from './utils'

const useTagGroup: UseTagGroupInterface = <Item>(
  userProps: UseTagGroupProps<Item> = {},
) => {
  /* State and Props */

  validatePropTypes(userProps, useTagGroup, propTypes)

  const props = getMergedProps(userProps)

  const [state, dispatch] = useControlledReducer<
    UseTagGroupState<Item>,
    UseTagGroupMergedProps<Item>,
    UseTagGroupStateChangeTypes,
    UseTagGroupReducerAction<Item>
  >(useTagGroupReducer, props, getInitialState, isStateEqual)

  const {activeIndex, items} = state

  /* Refs */

  const latest = useLatestRef({state, props})
  const elementIds = useElementIds({
    getTagId: props.getTagId,
    id: props.id,
    tagGroupId: props.tagGroupId,
  })

  /* Effects */

  useAccessibleDescription(
    props.environment?.document,
    props.removeElementDescription,
  )

  const itemRefs = useRovingTagFocus(
    activeIndex,
    items.length,
    elementIds.getTagId,
  )

  /* Getter functions */

  const getTagGroupProps = useCallback(
    <Extra extends Record<string, unknown>>(
      options?: GetTagGroupPropsOptions & Extra,
    ) => {
      const {onKeyDown, ...rest} =
        options ?? ({} as GetTagGroupPropsOptions & Extra)
      const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>): void => {
        switch (e.key) {
          case 'ArrowLeft':
            dispatch({
              type: stateChangeTypes.TagGroupKeyDownArrowLeft,
            })
            break
          case 'ArrowRight':
            dispatch({
              type: stateChangeTypes.TagGroupKeyDownArrowRight,
            })
            break
          case 'Delete':
            dispatch({
              type: stateChangeTypes.TagGroupKeyDownDelete,
            })
            break
          case 'Backspace':
            dispatch({
              type: stateChangeTypes.TagGroupKeyDownBackspace,
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
        role: 'listbox',
        onKeyDown: callAllEventHandlers(onKeyDown, handleKeyDown),
        ...rest,
      } as GetTagGroupPropsReturnValue & Extra

      return tagGroupProps
    },
    [dispatch, elementIds.tagGroupId],
  )

  const getTagProps = useCallback(
    <Extra extends Record<string, unknown>>(
      options: GetTagPropsOptions & Extra,
    ) => {
      const {index, refKey = 'ref', ref, onClick, ...rest} = options

      if (!Number.isInteger(index) || index < 0) {
        throw new Error('Pass correct item index to getTagProps!')
      }

      const latestState = latest.current.state

      const handleClick = () => {
        dispatch({type: stateChangeTypes.TagClick, index})
      }
      const tagId = elementIds.getTagId(index)

      return {
        'aria-describedby': A11Y_DESCRIPTION_ELEMENT_ID,
        [refKey]: handleRefs(ref, itemNode => {
          if (itemNode) {
            itemRefs.current[tagId] = itemNode
          }
        }),
        'aria-labelledby': tagId,
        role: 'option',
        id: tagId,
        onClick: callAllEventHandlers(onClick, handleClick),
        tabIndex: latestState.activeIndex === index ? 0 : -1,
        ...rest,
      } as GetTagPropsReturnValue & Extra
    },
    [dispatch, elementIds, latest, itemRefs],
  )

  const getTagRemoveProps = useCallback(
    <Extra extends Record<string, unknown>>(
      options: GetTagRemovePropsOptions & Extra,
    ) => {
      const {index, onClick, ...rest} = options

      if (!Number.isInteger(index) || index < 0) {
        throw new Error('Pass correct item index to getTagRemoveProps!')
      }

      const handleClick = (event: React.MouseEvent) => {
        event.stopPropagation()
        dispatch({type: stateChangeTypes.TagRemoveClick, index})
      }

      const tagId = elementIds.getTagId(index)
      const tagRemoveId = `${tagId}-remove`

      return {
        id: tagRemoveId,
        tabIndex: -1,
        'aria-labelledby': `${tagRemoveId} ${tagId}`,
        onClick: callAllEventHandlers(onClick, handleClick),
        ...rest,
      } as GetTagRemovePropsReturnValue & Extra
    },
    [elementIds, dispatch],
  )

  /* Imperative Functions */

  const addItem = useCallback<UseTagGroupReturnValue<Item>['addItem']>(
    (item, index): void => {
      dispatch({type: stateChangeTypes.FunctionAddItem, item, index})
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

useTagGroup.stateChangeTypes = stateChangeTypes

export default useTagGroup
