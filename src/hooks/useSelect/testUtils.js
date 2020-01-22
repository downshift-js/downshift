import React from 'react'
import {render, fireEvent} from '@testing-library/react'
import {renderHook} from '@testing-library/react-hooks'
import userEvent from '@testing-library/user-event'
import {defaultProps} from '../utils'
import {items} from '../testUtils'
import useSelect from '.'

jest.mock('../../utils', () => {
  const utils = require.requireActual('../../utils')

  return {
    ...utils,
    generateId: () => 'test-id',
  }
})

const dataTestIds = {
  toggleButton: 'toggle-button-id',
  menu: 'menu-id',
  item: index => `item-id-${index}`,
}

const renderUseSelect = props => {
  return renderHook(() => useSelect({items, ...props}))
}

const renderSelect = props => {
  const wrapper = render(<DropdownSelect {...props} />)
  const label = wrapper.getByText(/choose an element/i)
  const menu = wrapper.getByRole('listbox')
  const toggleButton = wrapper.getByTestId(dataTestIds.toggleButton)
  const getItemAtIndex = index => wrapper.getByTestId(dataTestIds.item(index))
  const getItems = () => wrapper.queryAllByRole('option')
  const clickOnItemAtIndex = index => {
    fireEvent.click(getItemAtIndex(index))
  }
  const clickOnToggleButton = () => {
    userEvent.click(toggleButton)
  }
  const mouseMoveItemAtIndex = index => {
    fireEvent.mouseMove(getItemAtIndex(index))
  }
  const keyDownOnToggleButton = (key, options = {}) => {
    fireEvent.keyDown(toggleButton, {key, ...options})
  }
  const focusToggleButton = () => {
    toggleButton.focus()
  }
  const tab = (shiftKey = false) => {
    userEvent.tab({shift: shiftKey})
  }
  const blurToggleButton = () => {
    toggleButton.blur()
  }
  const getA11yStatusContainer = () => wrapper.queryByRole('status')
  const mouseLeaveMenu = () => {
    fireEvent.mouseLeave(menu)
  }

  return {
    ...wrapper,
    label,
    menu,
    toggleButton,
    getItemAtIndex,
    clickOnItemAtIndex,
    mouseMoveItemAtIndex,
    getItems,
    keyDownOnToggleButton,
    clickOnToggleButton,
    focusToggleButton,
    tab,
    blurToggleButton,
    getA11yStatusContainer,
    mouseLeaveMenu,
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
  return (
    <div>
      <label {...getLabelProps()}>Choose an element:</label>
      <button
        data-testid={dataTestIds.toggleButton}
        {...getToggleButtonProps()}
      >
        {(selectedItem && selectedItem instanceof Object
          ? defaultProps.itemToString(selectedItem)
          : selectedItem) || 'Elements'}
      </button>
      <ul data-testid={dataTestIds.menu} {...getMenuProps()}>
        {isOpen &&
          (props.items || items).map((item, index) => {
            const stringItem =
              item instanceof Object ? defaultProps.itemToString(item) : item
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
