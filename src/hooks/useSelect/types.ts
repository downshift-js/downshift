/* Internal Types */

export interface GetItemIndexByCharacterKeyOptions<Item> {
  keysSoFar: string
  highlightedIndex: number
  items: Item[]
  itemToString(item: Item | null): string
  isItemDisabled(item: Item, index: number): boolean
}
