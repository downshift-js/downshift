import * as React from 'react'

import {useCombobox} from '../../src'
import {colors} from '../utils'

export default function DropdownCombobox() {
  const [inputItems, setInputItems] = React.useState(colors)
  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    selectedItem,
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
  return (
    <div className="container">
      <label
        className="example-label"
        style={selectedItem ? {color: selectedItem} : undefined}
        {...getLabelProps()}
      >
        Choose an element:
      </label>
      <div>
        <input
          className="example-input"
          {...getInputProps()}
          data-testid="combobox-input"
        />
        <button
          className="example-button"
          aria-label="toggle menu"
          data-testid="combobox-toggle-button"
          {...getToggleButtonProps()}
        >
          {isOpen ? <>&#8593;</> : <>&#8595;</>}
        </button>
        <button
          className="example-button"
          aria-label="clear selection"
          data-testid="clear-button"
          onClick={() => selectItem(null)}
        >
          &#10007;
        </button>
      </div>
      <ul {...getMenuProps()} className="menu">
        {isOpen
          ? inputItems.map((item, index) => (
              <li
                className={`example-menu-item${
                  highlightedIndex === index ? ' highlighted' : ''
                }`}
                key={`${item}${index}`}
                {...getItemProps({
                  item,
                  index,
                  'data-testid': `downshift-item-${index}`,
                })}
              >
                {item}
              </li>
            ))
          : null}
      </ul>
    </div>
  )
}
