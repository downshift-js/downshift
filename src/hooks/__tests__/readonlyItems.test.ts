import {act, renderHook} from '@testing-library/react'
import useSelect from '../useSelect'
import useCombobox from '../useCombobox'
import useMultipleSelection from '../useMultipleSelection'
import {
  UseMultipleSelectionInterface,
  UseMultipleSelectionProps,
} from '../useMultipleSelection/index.types'

const items = Object.freeze(['Apple', 'Orange'] as const)

// The legacy JavaScript hook exposes this declaration to package consumers.
const useTypedMultipleSelection =
  useMultipleSelection as UseMultipleSelectionInterface

function renderSelection(props: UseMultipleSelectionProps<string> = {}) {
  return renderHook(() => {
    const selection = useTypedMultipleSelection(props)
    selection.getDropdownProps({}, {suppressRefError: true})
    return selection
  })
}

test('useSelect accepts a readonly tuple without mutating it', () => {
  const {result} = renderHook(() => {
    const select = useSelect({items})
    select.getMenuProps({}, {suppressRefError: true})
    select.getToggleButtonProps({}, {suppressRefError: true})
    return select
  })

  act(() => result.current.openMenu())
  expect(result.current.isOpen).toBe(true)
  act(() => result.current.setHighlightedIndex(0))
  expect(result.current.highlightedIndex).toBe(0)
  act(() => result.current.selectItem(items[1]))

  const selected: (typeof items)[number] | null = result.current.selectedItem
  expect(selected).toBe('Orange')
  expect(items).toEqual(['Apple', 'Orange'])
})

test('useCombobox accepts a readonly tuple without mutating it', () => {
  const {result} = renderHook(() => {
    const combobox = useCombobox({items})
    combobox.getMenuProps({}, {suppressRefError: true})
    combobox.getInputProps({}, {suppressRefError: true})
    return combobox
  })

  act(() => result.current.selectItem(items[1]))

  const selected: (typeof items)[number] | null = result.current.selectedItem
  expect(selected).toBe('Orange')
  expect(result.current.inputValue).toBe('Orange')
  expect(items).toEqual(['Apple', 'Orange'])
})

test('useMultipleSelection accepts readonly controlled items', () => {
  let changedItems: readonly string[] | undefined
  const {result} = renderSelection({
    selectedItems: items,
    onSelectedItemsChange(changes) {
      changedItems = changes.selectedItems
    },
  })

  act(() => result.current.removeSelectedItem('Apple'))

  expect(changedItems).toEqual(['Orange'])
  expect(result.current.selectedItems).toBe(items)
  expect(items).toEqual(['Apple', 'Orange'])
})

test('useMultipleSelection accepts readonly initial and default items', () => {
  const initialItems = Object.freeze(['Apple'])
  const {result} = renderSelection({
    initialSelectedItems: initialItems,
    defaultSelectedItems: items,
  })

  expect(result.current.selectedItems).toEqual(['Apple'])
  act(() => result.current.addSelectedItem('Orange'))
  expect(result.current.selectedItems).toEqual(['Apple', 'Orange'])
  act(() => result.current.removeSelectedItem('Apple'))
  expect(result.current.selectedItems).toEqual(['Orange'])
  act(() => result.current.reset())
  expect(result.current.selectedItems).toBe(items)
  expect(initialItems).toEqual(['Apple'])
})

test('useMultipleSelection accepts readonly items in its setter', () => {
  const {result} = renderSelection()

  act(() => result.current.setSelectedItems(items))
  expect(result.current.selectedItems).toBe(items)
  act(() => result.current.removeSelectedItem('Apple'))
  expect(result.current.selectedItems).toEqual(['Orange'])
  expect(items).toEqual(['Apple', 'Orange'])
})

test('mutable selection arrays remain supported', () => {
  const mutableItems = ['Apple']
  const {result} = renderSelection({initialSelectedItems: mutableItems})

  act(() => result.current.setSelectedItems(['Orange']))

  const selectedItems: readonly string[] = result.current.selectedItems
  expect(selectedItems).toEqual(['Orange'])
  expect(mutableItems).toEqual(['Apple'])
})
