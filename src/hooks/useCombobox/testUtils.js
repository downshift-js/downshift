import React from 'react'
import {render, fireEvent} from '@testing-library/react'
import {renderHook} from '@testing-library/react-hooks'
import userEvent from '@testing-library/user-event'
import {defaultProps} from '../utils'
import useCombobox from '.'

jest.mock('./utils', () => {
  const utils = require.requireActual('./utils')

  return {
    ...utils,
    getElementIds: ({
      id,
      labelId,
      menuId,
      getItemId,
      toggleButtonId,
      inputId,
    } = {}) => {
      const prefix = id || 'downshift'

      return {
        labelId: labelId || `${prefix}-label`,
        menuId: menuId || `${prefix}-menu`,
        getItemId: getItemId || (index => `${prefix}-item-${index}`),
        toggleButtonId: toggleButtonId || `${prefix}-toggle-button`,
        inputId: inputId || `${prefix}-input`,
      }
    },
  }
})

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

const defaultIds = {
  labelId: 'downshift-label',
  menuId: 'downshift-menu',
  getItemId: index => `downshift-item-${index}`,
  toggleButtonId: 'downshift-toggle-button',
  inputId: 'downshift-input',
}

const dataTestIds = {
  toggleButton: 'toggle-button-id',
  item: index => `item-id-${index}`,
  input: 'input-id',
}

const renderCombobox = props => {
  const wrapper = render(<DropdownCombobox {...props} />)
  const label = wrapper.getByText(/choose an element/i)
  const menu = wrapper.getByRole('listbox')
  const toggleButton = wrapper.getByTestId(dataTestIds.toggleButton)
  const input = wrapper.getByTestId(dataTestIds.input)
  const combobox = wrapper.getByRole('combobox')
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
  const focusToggleButton = () => {
    toggleButton.focus()
  }
  const tab = (shiftKey = false) => {
    userEvent.tab({shift: shiftKey})
  }
  const getA11yStatusContainer = () => wrapper.queryByRole('status')
  const mouseLeaveMenu = () => {
    fireEvent.mouseLeave(menu)
  }
  const changeInputValue = async inputValue => {
    await userEvent.type(input, inputValue)
  }
  const focusInput = () => {
    input.focus()
  }
  const keyDownOnInput = (key, options = {}) => {
    if (document.activeElement !== input) {
      focusInput()
    }

    fireEvent.keyDown(input, {key, ...options})
  }
  const blurInput = () => {
    input.blur()
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
    clickOnToggleButton,
    focusToggleButton,
    tab,
    getA11yStatusContainer,
    mouseLeaveMenu,
    input,
    combobox,
    changeInputValue,
    keyDownOnInput,
    blurInput,
    focusInput,
  }
}

const DropdownCombobox = props => {
  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({items, ...props})
  return (
    <div>
      <label {...getLabelProps()}>Choose an element:</label>
      <div data-testid={dataTestIds.combobox} {...getComboboxProps()}>
        <input data-testid={dataTestIds.input} {...getInputProps()} />
        <button
          data-testid={dataTestIds.toggleButton}
          {...getToggleButtonProps()}
        >
          Toggle
        </button>
      </div>
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

const renderUseCombobox = props => {
  return renderHook(() => useCombobox({items, ...props}))
}

export {renderUseCombobox, dataTestIds, defaultIds, items, renderCombobox}
