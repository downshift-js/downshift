import * as React from 'react'

import {useSelect} from '../../src'
import {colors, getExampleLabelClassName} from '../utils'

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
        className={getExampleLabelClassName(selectedItem)}
        {...getLabelProps()}
      >
        Choose an element:
      </label>
      <div className="example-select-toggle" {...getToggleButtonProps()}>
        {selectedItem ?? 'Elements'}
        {isOpen ? <>&#8593;</> : <>&#8595;</>}
      </div>
      <ul {...getMenuProps()} className="menu">
        {isOpen
          ? colors.map((item, index) => (
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
