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
  const items = props.items ?? props.initialItems ?? []
  const activeIndex =
    props.activeIndex ??
    props.initialActiveIndex ??
    (items.length === 0 ? -1 : 0)

  return {
    activeIndex,
    items,
  }
}
