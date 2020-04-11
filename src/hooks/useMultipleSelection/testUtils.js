import * as React from 'react'

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
  selectedItemPrefix: 'selected-item-id',
  selectedItem: index => `selected-item-id-${index}`,
  input: 'input-id',
}

const DropdownMultipleCombobox = ({
  multipleSelectionProps,
  comboboxProps = {},
}) => {
  const {
    getSelectedItemProps,
    getDropdownProps,
    selectedItems,
  } = useMultipleSelection(multipleSelectionProps)
  const {
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
  } = useCombobox({
    items,
    ...comboboxProps,
  })
  const {itemToString} = multipleSelectionProps.itemToString
    ? multipleSelectionProps
    : defaultProps

  return (
    <div>
      <label {...getLabelProps()}>Choose an element:</label>
      <div style={{display: 'flex', flexWrap: 'wrap'}}>
        {selectedItems.map((selectedItem, index) => (
          <span
            key={`selected-item-${index}`}
            data-testid={dataTestIds.selectedItem(index)}
            {...getSelectedItemProps({selectedItem, index})}
          >
            {itemToString(selectedItem)}
          </span>
        ))}
        <div data-testid={dataTestIds.combobox} {...getComboboxProps()}>
          <input
            data-testid={dataTestIds.input}
            {...getInputProps(getDropdownProps())}
          />
          <button {...getToggleButtonProps()}>Toggle</button>
        </div>
      </div>
      <ul data-testid={dataTestIds.menu} {...getMenuProps()} />
    </div>
  )
}

export const renderMultipleCombobox = props => {
  const wrapper = render(<DropdownMultipleCombobox {...props} />)
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
  const keyDownOnInput = (key, options = {}) => {
    if (document.activeElement !== input) {
      focusInput()
    }

    fireEvent.keyDown(input, {key, ...options})
  }
  const clickOnInput = () => {
    fireEvent.click(input)
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
    keyDownOnInput,
    focusInput,
    clickOnInput,
  }
}

export const renderUseMultipleSelection = props => {
  return renderHook(() => useMultipleSelection(props))
}
