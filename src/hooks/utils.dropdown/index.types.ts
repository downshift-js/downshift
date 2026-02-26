export interface DropdownState<Item = unknown> extends Record<string, unknown> {
  highlightedIndex: number
  selectedItem: Item | null
  isOpen: boolean
  inputValue: string
}

export type DropdownProps<Item = unknown> = {
  isOpen?: boolean
  inputValue?: string
  highlightedIndex?: number
  selectedItem?: Item | null
  items: Item[]
  itemToKey: (item: Item) => string
  isItemDisabled: (item: Item, index: number) => boolean
  itemToString: (item: Item) => string
}
