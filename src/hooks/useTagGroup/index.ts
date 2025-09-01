import {useEffect, useCallback, useRef} from 'react'

import {
  callAllEventHandlers,
  handleRefs,
  useLatestRef,
  validatePropTypes,
} from '../../utils-ts'
import {useControlledReducer, useIsInitialMount} from '../utils-ts'
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
import {
  getInitialState,
  isStateEqual,
  propTypes,
  useElementIds,
  useAccessibleDescription,
  A11Y_DESCRIPTION_ELEMENT_ID,
} from './utils'

// eslint-disable-next-line
const {isReactNative} = require('../../is.macro.js')

useTagGroup.stateChangeTypes = stateChangeTypes

export default function useTagGroup<Item>(
  userProps: Partial<UseTagGroupProps<Item>> = {},
): UseTagGroupReturnValue<Item> {
  validatePropTypes(userProps, useTagGroup, propTypes)
  // Props defaults and destructuring.
  const defaultProps: Pick<
    UseTagGroupProps<Item>,
    'stateReducer' | 'environment' | 'removeElementDescription'
  > = {
    stateReducer(_s, {changes}) {
      return changes
    },
    environment:
      /* istanbul ignore next (ssr) */
      typeof window === 'undefined' || isReactNative ? undefined : window,
    removeElementDescription: 'Press Delete to remove tag.',
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
  >(useTagGroupReducer, props, getInitialState, isStateEqual)

  const {activeIndex, items} = state

  // utility callback to get item element.
  const latest = useLatestRef({state, props})
  // prevent id re-generation between renders.
  const elementIds = useElementIds(props)
  const itemRefs = useRef<Record<string, HTMLElement>>({})
  const previousItemsLengthRef = useRef(items.length)
  const isInitialMount = useIsInitialMount()

  useAccessibleDescription(
    props.environment?.document,
    props.removeElementDescription,
  )

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
        dispatch({type: stateChangeTypes.TagClick, index})
      }
      const id = elementIds.getTagId(index)

      return {
        'aria-describedby': A11Y_DESCRIPTION_ELEMENT_ID,
        [refKey]: handleRefs(ref, itemNode => {
          if (itemNode) {
            itemRefs.current[id] = itemNode
          }
        }),
        'aria-labelledby': id,
        role: 'option',
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
        dispatch({type: stateChangeTypes.TagRemoveClick, index})
      }

      const tagId = elementIds.getTagId(index)
      const id = `${tagId}-remove`

      return {
        id,
        tabIndex: -1,
        'aria-labelledby': `${id} ${tagId}`,
        onClick: callAllEventHandlers(onClick, handleClick),
        ...rest,
      }
    },
    [elementIds, dispatch],
  ) as GetTagRemoveProps

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
