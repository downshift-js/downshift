import React from 'react'
import {render, fireEvent} from '@testing-library/react'
import {renderHook} from '@testing-library/react-hooks'
import userEvent from '@testing-library/user-event'
import {defaultProps} from '../utils'
import useSelect from '.'

const items = [
  'Neptunium',
  'Plutonium',
  'Americium',
  'Curium',
  'Berkelium',
  'Californium',
  'Einsteinium',
  'Fermium',
  'Mendelevium',
  'Nobelium',
  'Lawrencium',
  'Rutherfordium',
  'Dubnium',
  'Seaborgium',
  'Bohrium',
  'Hassium',
  'Meitnerium',
  'Darmstadtium',
  'Roentgenium',
  'Copernicium',
  'Nihonium',
  'Flerovium',
  'Moscovium',
  'Livermorium',
  'Tennessine',
  'Oganesson',
]

jest.mock('../utils', () => {
  const utils = require.requireActual('../utils')

  return {
    ...utils,
    getElementIds: ({id, labelId, menuId, getItemId, toggleButtonId} = {}) => {
      const prefix = id || 'downshift'

      return {
        labelId: labelId || `${prefix}-label`,
        menuId: menuId || `${prefix}-menu`,
        getItemId: getItemId || (index => `${prefix}-item-${index}`),
        toggleButtonId: toggleButtonId || `${prefix}-toggle-button`,
      }
    },
  }
})

const defaultIds = {
  labelId: 'downshift-label',
  menuId: 'downshift-menu',
  getItemId: index => `downshift-item-${index}`,
  toggleButtonId: 'downshift-toggle-button',
}

const dataTestIds = {
  toggleButton: 'toggle-button-id',
  menu: 'menu-id',
  item: index => `item-id-${index}`,
}

const setupHook = props => {
  return renderHook(() => useSelect({items, ...props}))
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

const setup = props => render(<DropdownSelect {...props} />)

export {
  dataTestIds,
  setup,
  items,
  setupHook,
  defaultIds,
  renderUseSelect,
  renderSelect,
  DropdownSelect,
}
