import * as React from 'react'

import {render, screen} from '@testing-library/react'
import {renderHook} from '@testing-library/react-hooks'
import {defaultProps} from '../utils'
import {items, user, dataTestIds} from '../testUtils'
import useCombobox from '../useCombobox'
import {getInput, keyDownOnInput} from '../useCombobox/testUtils'
import useMultipleSelection from '.'

export * from '../testUtils'
export {getInput, keyDownOnInput}

jest.mock('../../utils', () => {
  const utils = jest.requireActual('../../utils')

  return {
    ...utils,
    generateId: () => 'test-id',
  }
})

jest.mock('../utils', () => {
  const utils = jest.requireActual('../utils')
  const hooksUtils = jest.requireActual('../../utils')

  return {
    ...utils,
    useGetterPropsCalledChecker: () => hooksUtils.noop,
  }
})

beforeEach(jest.resetAllMocks)
afterAll(jest.restoreAllMocks)

export function getSelectedItemAtIndex(index) {
  return screen.getByTestId(dataTestIds.selectedItem(index))
}

export function getSelectedItems() {
  return screen.queryAllByTestId(new RegExp(dataTestIds.selectedItemPrefix))
}

export async function clickOnSelectedItemAtIndex(index) {
  await user.click(getSelectedItemAtIndex(index))
}
export async function keyDownOnSelectedItemAtIndex(index, key) {
  const selectedItem = getSelectedItemAtIndex(index)

  if (document.activeElement !== selectedItem) {
    selectedItem.focus()
  }

  await user.keyboard(key)
}

export function focusSelectedItemAtIndex(index) {
  getSelectedItemAtIndex(index).focus()
}

export async function clickOnInput() {
  await user.click(getInput())
}

const DropdownMultipleCombobox = ({
  multipleSelectionProps = {},
  comboboxProps = {},
}) => {
  const {getSelectedItemProps, getDropdownProps, selectedItems} =
    useMultipleSelection(multipleSelectionProps)
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
  const utils = render(<DropdownMultipleCombobox {...props} />)
  const rerender = newProps =>
    utils.rerender(<DropdownMultipleCombobox {...newProps} />)

  return {
    ...utils,
    rerender,
  }
}

export const renderUseMultipleSelection = props => {
  return renderHook(() => useMultipleSelection(props))
}
