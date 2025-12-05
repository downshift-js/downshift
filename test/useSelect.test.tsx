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

export default function DropdownSelect() {
  const {
    isOpen,
    selectedItem,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getItemProps,
  } = useSelect({items: colors})

  return (
    <div>
      <label {...getLabelProps()}>Choose an element:</label>
      <div {...getToggleButtonProps()}>
        {selectedItem ?? 'Elements'}
        {isOpen ? <>&#8593;</> : <>&#8595;</>}
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
