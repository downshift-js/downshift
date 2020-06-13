import React, {useState} from 'react'
import {useCombobox} from '../../src'
import {items, menuStyles, comboboxStyles} from '../utils'

export default function DropdownCombobox() {
  const [inputItems, setInputItems] = useState(items)
  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    items: inputItems,
    onInputValueChange: ({inputValue}) => {
      setInputItems(
        items.filter(item =>
          item.toLowerCase().startsWith(inputValue.toLowerCase()),
        ),
      )
    },
  })
  return (
    <div>
      <label {...getLabelProps()}>Choose an element:</label>
      <div style={comboboxStyles} {...getComboboxProps()}>
        <input {...getInputProps()} data-testid="combobox-input" />
        <button
          data-testid="combobox-toggle-button"
          {...getToggleButtonProps()}
          aria-label="toggle menu"
        >
          &#8595;
        </button>
      </div>
      <ul {...getMenuProps()} style={menuStyles}>
        {isOpen &&
          inputItems.map((item, index) => (
            <li
              style={
                highlightedIndex === index ? {backgroundColor: '#bde4ff'} : {}
              }
              key={`${item}${index}`}
              {...getItemProps({
                item,
                index,
                'data-testid': `downshift-item-${index}`,
              })}
            >
              {item}
            </li>
          ))}
      </ul>
    </div>
  )
}
