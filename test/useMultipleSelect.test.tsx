import * as React from 'react'

export const colors = [
  'Black',
  'Red',
  'Green',
  'Blue',
  'Orange',
  'Purple',
  'Pink',
  'Orchid',
  'Aqua',
  'Lime',
  'Gray',
  'Brown',
  'Teal',
  'Skyblue',
]

const initialSelectedItems = colors.slice(0, 2)

function getFilteredItems(selectedItems: string[]): string[] {
  return colors.filter(colour => !selectedItems.includes(colour))
}

export default function DropdownMultipleSelect() {
  const {
    getSelectedItemProps,
    getDropdownProps,
    addSelectedItem,
    removeSelectedItem,
    selectedItems,
  } = useMultipleSelection({initialSelectedItems})
  const items = getFilteredItems(selectedItems)
  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getItemProps,
  } = useSelect({
    items,
    selectedItem: null,
    stateReducer(_state, actionAndChanges) {
      const {changes, type} = actionAndChanges
      switch (type) {
        case useSelect.stateChangeTypes.ToggleButtonKeyDownEnter:
        case useSelect.stateChangeTypes.ToggleButtonKeyDownSpaceButton:
        case useSelect.stateChangeTypes.ItemClick:
          return {
            ...changes,
            isOpen: true, // keep the menu open after selection.
          }
        default:
          return changes
      }
    },
    onStateChange({type, selectedItem: newSelectedItem}) {
      switch (type) {
        case useSelect.stateChangeTypes.ToggleButtonKeyDownEnter:
        case useSelect.stateChangeTypes.ToggleButtonKeyDownSpaceButton:
        case useSelect.stateChangeTypes.ItemClick:
          if (newSelectedItem) {
            addSelectedItem(newSelectedItem)
          }
          break
        default:
          break
      }
    },
  })

  return (
    <div>
      <label {...getLabelProps()}>Choose an element:</label>
      <div>
        {selectedItems.map(function renderSelectedItem(
          selectedItemForRender,
          index,
        ) {
          return (
            <span
              key={`selected-item-${index}`}
              {...getSelectedItemProps({
                selectedItem: selectedItemForRender,
                index,
              })}
            >
              {selectedItemForRender}
              <span
                onClick={e => {
                  e.stopPropagation()
                  removeSelectedItem(selectedItemForRender)
                }}
              >
                &#10005;
              </span>
            </span>
          )
        })}
        <div
          {...getToggleButtonProps(
            getDropdownProps({preventKeyAction: isOpen}),
          )}
        >
          Elements {isOpen ? <>&#8593;</> : <>&#8595;</>}
        </div>
      </div>
      <ul {...getMenuProps()}>
        {isOpen &&
          colors.map((item, index) => (
            <li
              key={`${item}${index}`}
              {...getItemProps({
                item,
                index,
              })}
            >
              {item}
            </li>
          ))}
      </ul>
    </div>
  )
}
