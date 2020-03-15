import React from 'react'

import {render, fireEvent} from '@testing-library/react'
import {renderHook} from '@testing-library/react-hooks'
import {defaultProps} from '../utils'
import {items} from '../testUtils'
import useCombobox from '../useCombobox'
import useMultipleSelection from '.'

jest.mock('../../utils', () => {
  const utils = require.requireActual('../../utils')

  return {
    ...utils,
    generateId: () => 'test-id',
  }
})

export const dataTestIds = {
  toggleButton: 'toggle-button-id',
  itemPrefix: 'selected-item-id',
  item: index => `selected-item-id-${index}`,
  input: 'input-id',
}

const DropdownMultipleCombobox = (multipleProps = {}, comboboxProps = {}) => {
  const [inputValue, setInputValue] = React.useState('')
  const {
    getSelectedItemProps,
    getDropdownProps,
    addItem,
    items: selectedItems,
  } = useMultipleSelection(multipleProps)
  const getFilteredItems = itemsParameter =>
    itemsParameter.filter(
      item =>
        selectedItems.indexOf(item) < 0 &&
        item.toLowerCase().startsWith(inputValue.toLowerCase()),
    )
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
    inputValue,
    items: getFilteredItems(items),
    onStateChange: ({inputValue: inputValueParameter, type, selectedItem}) => {
      if (type === useCombobox.stateChangeTypes.InputChange) {
        setInputValue(inputValueParameter)

        return
      }

      if (selectedItem) {
        setInputValue('')
        addItem(selectedItem)
      }
    },
    ...comboboxProps,
  })
  const {itemToString} = comboboxProps.itemToString
    ? comboboxProps
    : defaultProps

  return (
    <div>
      <label {...getLabelProps()}>Choose an element:</label>
      <div style={{display: 'flex', flexWrap: 'wrap'}}>
        {selectedItems.map((selectedItem, index) => (
          <span
            key={`selected-item-${index}`}
            data-testid={dataTestIds.item(index)}
            {...getSelectedItemProps({item: selectedItem, index})}
          >
            {selectedItem}
          </span>
        ))}
        <div data-testid={dataTestIds.combobox} {...getComboboxProps()}>
          <input
            data-testid={dataTestIds.input}
            {...getInputProps(getDropdownProps())}
          />
          <button
            data-testid={dataTestIds.toggleButton}
            {...getToggleButtonProps()}
          >
            Toggle
          </button>
        </div>
      </div>
      <ul data-testid={dataTestIds.menu} {...getMenuProps()}>
        {isOpen &&
          (comboboxProps.items || items).map((item, index) => {
            const stringItem =
              item instanceof Object ? itemToString(item) : item
            return (
              <li
                data-testid={dataTestIds.item(index)}
                style={
                  highlightedIndex === index ? {backgroundColor: 'blue'} : {}
                }
                key={`${stringItem}${index}`}
                {...getItemProps({item, index})}
              >
                {stringItem}
              </li>
            )
          })}
      </ul>
    </div>
  )
}

export const renderMultipleCombobox = (props, uiCallback) => {
  const ui = <DropdownMultipleCombobox {...props} />
  const wrapper = render(uiCallback ? uiCallback(ui) : ui)
  const label = wrapper.getByText(/choose an element/i)
  const menu = wrapper.getByRole('listbox')
  const input = wrapper.getByTestId(dataTestIds.input)
  const getItemAtIndex = index => wrapper.getByTestId(dataTestIds.item(index))
  const getItems = () =>
    wrapper.queryAllByTestId(new RegExp(dataTestIds.itemPrefix))
  const clickOnItemAtIndex = index => {
    fireEvent.click(getItemAtIndex(index))
  }
  const mouseMoveItemAtIndex = index => {
    fireEvent.mouseMove(getItemAtIndex(index))
  }
  const getA11yStatusContainer = () => wrapper.queryByRole('status')
  const focusInput = () => {
    input.focus()
  }
  const keyDownOnDropdown = (key, options = {}) => {
    if (document.activeElement !== input) {
      focusInput()
    }

    fireEvent.keyDown(input, {key, ...options})
  }

  return {
    ...wrapper,
    label,
    menu,
    getItemAtIndex,
    clickOnItemAtIndex,
    mouseMoveItemAtIndex,
    getItems,
    getA11yStatusContainer,
    input,
    keyDownOnDropdown,
    focusInput,
  }
}

export const renderUseMultupleSelection = props => {
  return renderHook(() => useMultipleSelection({...props}))
}
