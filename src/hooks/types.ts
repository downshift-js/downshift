/* Internal Types */

export interface GetItemIndexByCharacterKeyOptions<Item> {
  keysSoFar: string
  highlightedIndex: number
  items: Item[]
  itemToString(item: Item): string
  getItemNodeFromIndex(index: number): HTMLElement
}
