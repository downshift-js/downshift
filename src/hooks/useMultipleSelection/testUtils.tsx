import * as React from 'react'

import {render, fireEvent, screen} from '@testing-library/react'
import {renderHook} from '@testing-library/react-hooks'
import userEvent from '@testing-library/user-event'
import {UseComboboxProps} from '../../../typings'
import * as downshiftUtils from '../../utils'
import * as hooksUtils from '../utils'
import {items} from '../testUtils'
import useCombobox from '../useCombobox'
import useMultipleSelection from '.'
import {UseMultipleSelectionProps} from './types'

type DropdownMultipleComboboxProps<Item> = {
  multipleSelectionProps?: Partial<UseMultipleSelectionProps<Item>>
  comboboxProps?: Partial<UseComboboxProps<string>>
}

jest.spyOn(downshiftUtils, 'generateId').mockReturnValue('test-id')

jest.mock('../utils', () => {
  const noop = () => {}

  return {
    ...jest.requireActual('../utils'),
    useGetterPropsCalledChecker: () => noop,
  }
})

beforeEach(jest.resetAllMocks)
afterAll(jest.restoreAllMocks)

export const dataTestIds = {
  selectedItemPrefix: 'selected-item-id',
  selectedItem: (index: number) => `selected-item-id-${index}`,
  input: 'input-id',
  combobox: 'combobox-id',
  menu: 'menu-id',
}

function DropdownMultipleCombobox<Item>({
  multipleSelectionProps = {},
  comboboxProps = {},
}: Partial<DropdownMultipleComboboxProps<Item>> = {}) {
  const {
    getSelectedItemProps,
    getDropdownProps,
    selectedItems,
  } = useMultipleSelection<Item>(multipleSelectionProps)
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
  const itemToString =
    multipleSelectionProps.itemToString ?? hooksUtils.defaultProps.itemToString

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
export function renderMultipleCombobox<Item = string>(
  props: DropdownMultipleComboboxProps<Item> = {},
) {
  const utils = render(<DropdownMultipleCombobox<Item> {...props} />)
  const label = screen.getByText(/choose an element/i)
  const menu = screen.getByRole('listbox')
  const input = screen.getByTestId(dataTestIds.input) as HTMLInputElement
  const rerender = (newProps: DropdownMultipleComboboxProps<Item>) =>
    utils.rerender(<DropdownMultipleCombobox {...newProps} />)
  const getSelectedItemAtIndex = (index: number) =>
    screen.getByTestId(dataTestIds.selectedItem(index))
  const getSelectedItems = () =>
    screen.queryAllByTestId(new RegExp(dataTestIds.selectedItemPrefix))
  const clickOnSelectedItemAtIndex = (index: number) => {
    fireEvent.click(getSelectedItemAtIndex(index))
  }
  const keyDownOnSelectedItemAtIndex = (
    index: number,
    key: string,
    options = {},
  ) => {
    fireEvent.keyDown(getSelectedItemAtIndex(index), {key, ...options})
  }
  const focusSelectedItemAtIndex = (index: number) => {
    getSelectedItemAtIndex(index).focus()
  }
  const getA11yStatusContainer = () => screen.queryByRole('status')
  const focusInput = () => {
    input.focus()
  }
  const keyDownOnInput = (key: string, options = {}) => {
    if (document.activeElement !== input) {
      focusInput()
    }

    fireEvent.keyDown(input, {key, ...options})
  }
  const clickOnInput = () => {
    userEvent.click(input)
  }

  return {
    ...utils,
    label,
    menu,
    rerender,
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

export function renderUseMultipleSelection<Item = string> (
  props: Partial<UseMultipleSelectionProps<Item>> = {},
) {
  return renderHook(() => useMultipleSelection(props))
}
