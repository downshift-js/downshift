import * as React from 'react'

import Downshift from '../../src'
import {type ControllerStateAndHelpers} from '../../src/downshift.types'
import {colors} from '../utils'

export default function ComboBox() {
  return (
    <Downshift>
      {({
        getInputProps,
        getItemProps,
        getMenuProps,
        getLabelProps,
        getToggleButtonProps,
        highlightedIndex,
        inputValue,
        isOpen,
        selectedItem,
        getRootProps,
        clearSelection,
      }: ControllerStateAndHelpers<string>) => (
        <div className="container">
          <label
            className="example-label"
            style={selectedItem ? {color: selectedItem} : undefined}
            {...getLabelProps()}
          >
            Choose an element:
          </label>
          <div {...getRootProps({}, {suppressRefError: true})}>
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
              aria-label="toggle menu"
              data-testid="clear-button"
              onClick={() => clearSelection()}
            >
              &#10007;
            </button>
          </div>
          <ul {...getMenuProps()} className="menu">
            {isOpen
              ? (inputValue
                  ? colors.filter(i =>
                      i.toLowerCase().includes(inputValue.toLowerCase()),
                    )
                  : colors
                ).map((item, index) => (
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
      )}
    </Downshift>
  )
}
