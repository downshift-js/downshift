import * as React from 'react'
import Downshift from '..'

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

export default function ComboBox() {
  return (
    <Downshift>
      {({
        getInputProps,
        getItemProps,
        getMenuProps,
        getLabelProps,
        getToggleButtonProps,
        inputValue,
        isOpen,
        getRootProps,
        clearSelection,
      }) => (
        <div>
          <label {...getLabelProps()}>Choose an element:</label>
          <div {...getRootProps({}, {suppressRefError: true})}>
            <input {...getInputProps()} data-testid="combobox-input" />
            <button
              {...getToggleButtonProps({
                'aria-label': 'toggle menu',
                'data-testid': 'combobox-toggle-button',
              })}
            >
              {isOpen ? <>&#8593;</> : <>&#8595;</>}
            </button>
            <button
              aria-label="toggle menu"
              data-testid="clear-button"
              onClick={() => clearSelection()}
            >
              &#10007;
            </button>
          </div>
          <ul {...getMenuProps()}>
            {isOpen &&
              (inputValue
                ? colors.filter(i =>
                    i.toLowerCase().includes(inputValue.toLowerCase()),
                  )
                : colors
              ).map((item, index) => (
                <li
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
      )}
    </Downshift>
  )
}
