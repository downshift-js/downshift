import * as React from 'react'

import {useSelect} from '../../src'
import {colors} from '../utils'

export default function DropdownSelect() {
  const {
    isOpen,
    selectedItem,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useSelect({items: colors})

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
      <div
        style={{
          padding: '4px',
          textAlign: 'center',
          border: '1px solid black',
          backgroundColor: 'lightgray',
          cursor: 'pointer',
        }}
        {...getToggleButtonProps()}
      >
        {selectedItem ?? 'Elements'}
        {isOpen ? <>&#8593;</> : <>&#8595;</>}
      </div>
      <ul {...getMenuProps()} className="menu">
        {isOpen
          ? colors.map((item, index) => (
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
