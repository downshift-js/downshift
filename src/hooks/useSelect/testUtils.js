import * as React from 'react'
import {render, fireEvent, screen} from '@testing-library/react'
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

const dataTestIds = {
  toggleButton: 'toggle-button-id',
  menu: 'menu-id',
  item: index => `item-id-${index}`,
}

const renderUseSelect = props => {
  return renderHook(() => useSelect({items, ...props}))
}

const renderSelect = (props, uiCallback) => {
  const renderSpy = jest.fn()
  const ui = <DropdownSelect renderSpy={renderSpy} {...props} />
  const wrapper = render(uiCallback ? uiCallback(ui) : ui)
  const rerender = p =>
    wrapper.rerender(<DropdownSelect renderSpy={renderSpy} {...p} />)
  const label = screen.getByText(/choose an element/i)
  const menu = screen.getByRole('listbox')
  const toggleButton = screen.getByTestId(dataTestIds.toggleButton)
  const getItemAtIndex = index => screen.getByTestId(dataTestIds.item(index))
  const getItems = () => screen.queryAllByRole('option')
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
    fireEvent.blur(menu)
  }
  const getA11yStatusContainer = () => screen.queryByRole('status')
  const mouseLeaveMenu = () => {
    fireEvent.mouseLeave(menu)
  }
  const tab = (shiftKey = false) => {
    userEvent.tab({shift: shiftKey})
  }

  return {
    ...wrapper,
    renderSpy,
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

const DropdownSelect = ({renderSpy, renderItem, ...props}) => {
  const {
    isOpen,
    selectedItem,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getItemProps,
  } = useSelect({items, ...props})
  const {itemToString} = props.itemToString ? props : defaultProps

  renderSpy()

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
            return renderItem ? (
              renderItem({index, item, getItemProps, dataTestIds, stringItem})
            ) : (
              <li
                data-testid={dataTestIds.item(index)}
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
