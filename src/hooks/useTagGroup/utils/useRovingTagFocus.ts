import * as React from 'react'
import {UseTagGroupProps} from '../index.types'

/**
 * Focuses the tag at activeIndex when it changes or when an item is removed.
 */
export function useRovingTagFocus(
  activeIndex: number,
  itemsLength: number,
  getTagId: NonNullable<UseTagGroupProps<unknown>['getTagId']>,
): React.MutableRefObject<Record<string, HTMLElement>> {
  const itemRefs = React.useRef<Record<string, HTMLElement>>({})
  const previousActiveIndexRef = React.useRef(activeIndex)
  const previousItemsLengthRef = React.useRef(itemsLength)

  React.useEffect(() => {
    if (
      (activeIndex !== -1 &&
        previousActiveIndexRef.current !== -1 &&
        activeIndex !== previousActiveIndexRef.current) ||
      previousItemsLengthRef.current === itemsLength + 1
    ) {
      itemRefs.current[getTagId(activeIndex)]?.focus()
    }

    previousActiveIndexRef.current = activeIndex
    previousItemsLengthRef.current = itemsLength
  }, [activeIndex, getTagId, itemsLength])

  return itemRefs
}
