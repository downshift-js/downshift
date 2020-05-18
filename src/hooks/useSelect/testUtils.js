import * as React from 'react'
import {render, fireEvent} from '@testing-library/react'
import {renderHook} from '@testing-library/react-hooks'
import userEvent from '@testing-library/user-event'
import {defaultProps} from '../utils'
import {items} from '../testUtils'
import useSelect from '.'

jest.mock('../../utils', () => {
  const utils = jest.requireActual('../../utils')

  return {
    ...utils,
    generateId: () => 'test-id',
  }
})

/* istanbul ignore next */
beforeAll(() => jest.spyOn(console, 'error').mockImplementation(() => {}))
// eslint-disable-next-line no-console
beforeEach(() => console.error.mockReset())
// eslint-disable-next-line no-console
afterAll(() => console.error.mockRestore())

const dataTestIds = {
  toggleButton: 'toggle-button-id',
  menu: 'menu-id',
  item: index => `item-id-${index}`,
}

const renderUseSelect = props => {
  return renderHook(() => useSelect({items, ...props}))
}

const renderSelect = (props, uiCallback) => {
  const ui = <DropdownSelect {...props} />
  const wrapper = render(uiCallback ? uiCallback(ui) : ui)
  const rerender = p => wrapper.rerender(<DropdownSelect {...p} />)
  const label = wrapper.getByText(/choose an element/i)
  const menu = wrapper.getByRole('listbox')
  const toggleButton = wrapper.getByTestId(dataTestIds.toggleButton)
  const getItemAtIndex = index => wrapper.getByTestId(dataTestIds.item(index))
  const getItems = () => wrapper.queryAllByRole('option')
  const clickOnItemAtIndex = index => {
    fireEvent.click(getItemAtIndex(index))
  }
  const clickOnToggleButton = () => {
    fireEvent.click(toggleButton)
  }
  const mouseMoveItemAtIndex = index => {
    fireEvent.mouseMove(getItemAtIndex(index))
  }
  const keyDownOnToggleButton = (key, options = {}) => {
    fireEvent.keyDown(toggleButton, {key, ...options})
  }
  const keyDownOnMenu = (key, options = {}) => {
    fireEvent.keyDown(menu, {key, ...options})
  }
  const blurMenu = () => {
    menu.blur()
  }
  const getA11yStatusContainer = () => wrapper.queryByRole('status')
  const mouseLeaveMenu = () => {
    fireEvent.mouseLeave(menu)
  }
  const tab = (shiftKey = false) => {
    userEvent.tab({shift: shiftKey})
  }

  return {
    ...wrapper,
    rerender,
    label,
    menu,
    toggleButton,
    getItemAtIndex,
    clickOnItemAtIndex,
    mouseMoveItemAtIndex,
    getItems,
    keyDownOnToggleButton,
    clickOnToggleButton,
    blurMenu,
    getA11yStatusContainer,
    mouseLeaveMenu,
    keyDownOnMenu,
    tab,
  }
}

const DropdownSelect = props => {
  const {
    isOpen,
    selectedItem,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useSelect({items, ...props})
  const {itemToString} = props.itemToString ? props : defaultProps

  return (
    <div>
      <label {...getLabelProps()}>Choose an element:</label>
      <button
        data-testid={dataTestIds.toggleButton}
        {...getToggleButtonProps()}
      >
        {(selectedItem && selectedItem instanceof Object
          ? itemToString(selectedItem)
          : selectedItem) || 'Elements'}
      </button>
      <ul data-testid={dataTestIds.menu} {...getMenuProps()}>
        {isOpen &&
          (props.items || items).map((item, index) => {
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

export {items, renderUseSelect, renderSelect, DropdownSelect}
