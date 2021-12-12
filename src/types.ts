/* Internal Types */

export interface DropdownState<Item = unknown> {
  highlightedIndex: number
  inputValue: string
  isOpen: boolean
  selectedItem: Item | null
}

/* External Types */

export type A11yStatusMessageOptions<Item> = {
  highlightedIndex: number | null
  inputValue: string
  isOpen: boolean
  itemToString: (item: Item | null) => string
  previousResultCount: number
  resultCount: number
  highlightedItem: Item
  selectedItem: Item | null
}

export interface Environment {
  addEventListener: typeof window.addEventListener
  removeEventListener: typeof window.removeEventListener
  document: Document
}

export interface GetPropsWithRefKey {
  refKey?: string
}

export interface GetToggleButtonPropsOptions
  extends React.HTMLProps<HTMLButtonElement> {
  disabled?: boolean
}
