import {UseTagGroupProps, UseTagGroupState} from '../index.types'

export type UseElementIdsProps = Pick<
  UseTagGroupProps<unknown>,
  'id' | 'getTagId' | 'tagGroupId'
>
export type UseElementIdsReturnValue = Required<
  Pick<UseTagGroupProps<unknown>, 'getTagId' | 'tagGroupId'>
>

export function getInitialState<I>(
  props: UseTagGroupProps<I>,
): UseTagGroupState<I> {
  const items = props.items ?? props.initialItems ?? props.defaultItems ?? []
  const activeIndex =
    props.activeIndex ??
    props.initialActiveIndex ??
    props.defaultActiveIndex ??
    (items.length === 0 ? -1 : items.length - 1)

  return {
    activeIndex,
    items,
  }
}
