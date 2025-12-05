import {UseTagGroupState} from '../index.types'

export function isStateEqual<I>(
  oldState: UseTagGroupState<I>,
  newState: UseTagGroupState<I>,
): boolean {
  return (
    oldState.activeIndex === newState.activeIndex &&
    oldState.items === newState.items
  )
}
