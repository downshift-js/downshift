import * as React from 'react'

import Downshift from '../../src/downshift'

export default function ComboBox() {
  const items = ['Black', 'Red', 'Green', 'Blue', 'Orange', 'Purple']

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
      }) => (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: 'fit-content',
            justifyContent: 'center',
            marginTop: 100,
            alignSelf: 'center',
          }}
        >
          <label
            style={{
              fontWeight: 'bolder',
              color: selectedItem ? selectedItem : 'black',
            }}
            {...getLabelProps()}
          >
            Choose an element:
          </label>
          <div {...getRootProps({}, {suppressRefError: true})}>
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
              aria-label="toggle menu"
              data-testid="clear-button"
              onClick={clearSelection}
            >
              &#10007;
            </button>
          </div>
          <ul
            {...getMenuProps()}
            style={{
              listStyle: 'none',
              width: '100%',
              padding: '0',
              margin: '4px 0 0 0',
            }}
          >
            {isOpen &&
              (inputValue
                ? items.filter(i =>
                    i.toLowerCase().includes(inputValue.toLowerCase()),
                  )
                : items
              ).map((item, index) => (
                <li
                  style={{
                    padding: '4px',
                    backgroundColor:
                      highlightedIndex === index ? '#bde4ff' : null,
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
              ))}
          </ul>
        </div>
      )}
    </Downshift>
  )
}
