import * as React from 'react'
import {useCombobox} from '..'

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

export default function DropdownCombobox() {
  const [inputItems, setInputItems] = React.useState(colors)
  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getItemProps,
    selectItem,
  } = useCombobox({
    items: inputItems,
    onInputValueChange: ({inputValue}) => {
      setInputItems(
        colors.filter(item =>
          item.toLowerCase().startsWith(inputValue.toLowerCase()),
        ),
      )
    },
  })
  const inputRef = React.useRef<HTMLInputElement>(null)
  const toggleButtonRef = React.useRef<HTMLButtonElement>(null)
  const menuRef = React.useRef<HTMLUListElement>(null)
  const itemRef = React.useRef<HTMLLIElement>(null)

  return (
    <div>
      <label {...getLabelProps()}>Choose an element:</label>
      <div>
        <input
          {...getInputProps({ref: inputRef})}
          data-testid="combobox-input"
        />
        <button
          aria-label="toggle menu"
          data-testid="combobox-toggle-button"
          {...getToggleButtonProps({ref: toggleButtonRef})}
        >
          {isOpen ? <>&#8593;</> : <>&#8595;</>}
        </button>
        <button
          aria-label="toggle menu"
          data-testid="clear-button"
          onClick={() => selectItem(null)}
        >
          &#10007;
        </button>
      </div>
      <ul {...getMenuProps({ref: menuRef})}>
        {isOpen &&
          inputItems.map((item, index) => (
            <li
              key={`${item}${index}`}
              {...getItemProps({
                item,
                index,
                'data-testid': `downshift-item-${index}`,
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
