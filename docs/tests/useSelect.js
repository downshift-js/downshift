import React from 'react'
import {useSelect} from '../../src'
import {items, menuStyles} from '../utils'

export default function DropdownSelect() {
  const {
    isOpen,
    selectedItem,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useSelect({items})
  return (
    <div>
      <label {...getLabelProps()}>Choose an element:</label>
      <button data-testid='select-toggle-button' {...getToggleButtonProps()}>{selectedItem || 'Elements'}</button>
      <ul {...getMenuProps()} style={menuStyles}>
        {isOpen &&
          items.map((item, index) => (
            <li
              style={
                highlightedIndex === index ? {backgroundColor: '#bde4ff'} : {}
              }
              key={`${item}${index}`}
              {...getItemProps({item, index})}
            >
              {item}
            </li>
          ))}
      </ul>
    </div>
  )
}
