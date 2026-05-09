import * as React from 'react'

import {useCombobox} from '../../src'
import {colors} from '../utils'
import './shared.css'

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
        style={{
          fontWeight: 'bolder',
          color: selectedItem ? selectedItem : 'black',
        }}
        {...getLabelProps()}
      >
        Choose an element:
      </label>
      <div>
        <input
          style={{padding: '4px'}}
          {...getInputProps()}
          data-testid="combobox-input"
        />
        <button
          style={{padding: '4px 8px'}}
          aria-label="toggle menu"
          data-testid="combobox-toggle-button"
          {...getToggleButtonProps()}
        >
          {isOpen ? <>&#8593;</> : <>&#8595;</>}
        </button>
        <button
          style={{padding: '4px 8px'}}
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
                style={{
                  padding: '4px',
                  backgroundColor:
                    highlightedIndex === index ? '#bde4ff' : undefined,
                }}
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
