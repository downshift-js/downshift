export type DropdownState = {
  highlightedIndex: number
  selectedItem: unknown | null
  isOpen: boolean
  inputValue: string
}

export type DropdownProps = {
  isOpen?: boolean
  inputValue?: string
  highlightedIndex?: number
  selectedItem?: unknown | null
  items: unknown[]
  itemToKey: (item: unknown) => string
  isItemDisabled: (item: unknown, index: number) => boolean
  itemToString: (item: unknown) => string
}