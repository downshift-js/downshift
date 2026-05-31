import * as React from 'react'

import {useSelect} from '..'

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
  const toggleButtonRef = React.useRef<HTMLDivElement>(null)
  const menuRef = React.useRef<HTMLUListElement>(null)
  const itemRef = React.useRef<HTMLLIElement>(null)

  return (
    <div>
      <label {...getLabelProps()}>Choose an element:</label>
      <div {...getToggleButtonProps({ref: toggleButtonRef})}>
        {selectedItem ?? 'Elements'}
        {isOpen ? <>&#8593;</> : <>&#8595;</>}
      </div>
      <ul {...getMenuProps({ref: menuRef})}>
        {isOpen &&
          colors.map((item, index) => (
            <li
              key={`${item}${index}`}
              {...getItemProps({
                item,
                index,
                ref: index === 0 ? itemRef : undefined,
              })}
            >
              {item}
            </li>
          ))}
      </ul>
    </div>
  )
}
