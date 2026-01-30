type GetItemIndexByCharacterKeyOptions<Item> = {
  keysSoFar: string
  highlightedIndex: number
  items: Item[]
  itemToString(item: Item | null): string
  isItemDisabled(item: Item, index: number): boolean
}

export function getItemIndexByCharacterKey<Item>({
  keysSoFar,
  highlightedIndex,
  items,
  itemToString,
  isItemDisabled,
}: GetItemIndexByCharacterKeyOptions<Item>) {
  const lowerCasedKeysSoFar = keysSoFar.toLowerCase()

  for (let index = 0; index < items.length; index++) {
    // if we already have a search query in progress, we also consider the current highlighted item.
    const offsetIndex =
      (index + highlightedIndex + (keysSoFar.length < 2 ? 1 : 0)) % items.length

    const item = items[offsetIndex]

    if (
      item !== undefined &&
      itemToString(item).toLowerCase().startsWith(lowerCasedKeysSoFar) &&
      !isItemDisabled(item, offsetIndex)
    ) {
      return offsetIndex
    }
  }

  return highlightedIndex
}
