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

const renderMemoizedSelect = props => {
  const ui = <MemoizedDropdownSelect {...props} />
  const wrapper = render(ui)
  const rerender = p => wrapper.rerender(<MemoizedDropdownSelect {...p} />)
  const menu = screen.getByRole('listbox')
  const keyDownOnMenu = (key, options = {}) => {
    fireEvent.keyDown(menu, {key, ...options})
  }

  return {
    ...wrapper,
    rerender,
    menu,
    keyDownOnMenu,
  }
}

// Eslint incorrectly marks this as an error.
// PR that should've fixed this: https://github.com/yannickcr/eslint-plugin-react/pull/2109
// eslint-disable-next-line react/display-name
const DropdownItem = React.memo(({
  item,
  index,
  isDisabled,
  isHighlighted,
  getItemProps,
  stringItem,
  ...props
}) => {
  return (
    <li
      style={isHighlighted ? {backgroundColor: 'blue'} : {}}
      {...getItemProps({
        item,
        index,
        disabled: isDisabled,
      })}
      {...props}
    >
      {stringItem}
    </li>
  )
})

const MemoizedDropdownSelect = props => {
  const {
    isOpen,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useSelect({items, ...props})
  return (
    <div>
      <ul data-testid={dataTestIds.menu} {...getMenuProps()}>
        {isOpen &&
          (props.items || items).map((item, index) => {
            return (
              <DropdownItem
                data-testid={dataTestIds.item(index)}
                getItemProps={getItemProps}
                index={index}
                isDisabled={items.length - 2 === index}
                isHighlighted={highlightedIndex === index}
                item={item}
                key={`${item}${index}`}
                stringItem={item}
            />
            )
          })}
      </ul>
    </div>
  )
}

export {items, renderUseSelect, renderSelect, DropdownSelect, renderMemoizedSelect}
