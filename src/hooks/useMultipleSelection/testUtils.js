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
  itemPrefix: 'item-id',
  item: index => `item-id-${index}`,
  selectedItemPrefix: 'selected-item-id',
  selectedItem: index => `selected-item-id-${index}`,
  input: 'input-id',
}

const DropdownMultipleCombobox = ({
  multipleSelectionProps = {},
  comboboxProps = {},
}) => {
  const [inputValue, setInputValue] = React.useState('')
  const {
    getItemProps: getSelectedItemProps,
    getDropdownProps,
    addItem,
    items: selectedItems,
  } = useMultipleSelection(multipleSelectionProps)
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
            data-testid={dataTestIds.selectedItem(index)}
            {...getSelectedItemProps({item: selectedItem, index})}
          >
            {selectedItem instanceof Object
              ? itemToString(selectedItem)
              : selectedItem}
          </span>
        ))}
        <div data-testid={dataTestIds.combobox} {...getComboboxProps()}>
          <input
            data-testid={dataTestIds.input}
            {...getInputProps(getDropdownProps({isOpen}))}
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
  const getSelectedItemAtIndex = index =>
    wrapper.getByTestId(dataTestIds.selectedItem(index))
  const getSelectedItems = () =>
    wrapper.queryAllByTestId(new RegExp(dataTestIds.selectedItemPrefix))
  const clickOnSelectedItemAtIndex = index => {
    fireEvent.click(getSelectedItemAtIndex(index))
  }
  const keyDownOnSelectedItemAtIndex = (index, key, options = {}) => {
    fireEvent.keyDown(getSelectedItemAtIndex(index), {key, ...options})
  }
  const focusSelectedItemAtIndex = index => {
    getSelectedItemAtIndex(index).focus()
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
    getSelectedItemAtIndex,
    clickOnSelectedItemAtIndex,
    keyDownOnSelectedItemAtIndex,
    focusSelectedItemAtIndex,
    getSelectedItems,
    getA11yStatusContainer,
    input,
    keyDownOnDropdown,
    focusInput,
  }
}

export const renderUseMultipleSelection = props => {
  return renderHook(() => useMultipleSelection({...props}))
}
