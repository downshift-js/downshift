import React from 'react'
import {render} from '@testing-library/react'
import {renderHook} from '@testing-library/react-hooks'
import useDropdown from '.'

jest.mock('./utils', () => {
  const utils = require.requireActual('./utils')

  return {
    ...utils,
    getElementIds: ({
      labelId,
      menuId,
      getItemId,
      toggleButtonId,
      inputId,
    } = {}) => ({
      labelId: labelId || 'downshift-label',
      menuId: menuId || 'downshift-menu',
      getItemId: getItemId || (index => `downshift-item-${index}`),
      toggleButtonId: toggleButtonId || 'downshift-toggle-button',
      inputId: inputId || 'downshift-input',
    }),
  }
})

const defaultIds = {
  labelId: 'downshift-label',
  menuId: 'downshift-menu',
  getItemId: index => `downshift-item-${index}`,
  toggleButtonId: 'downshift-toggle-button',
  inputId: 'downshift-input',
}

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

const dataTestIds = {
  input: 'input-id',
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
  } = useDropdown({items, ...props})
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
            const stringItem = props.itemToString
              ? props.itemToString(item)
              : item
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

const renderCombobox = props => {
  const wrapper = render(<DropdownCombobox {...props} />)
  const combobox = wrapper.getByRole('combobox')
  const label = wrapper.getByText(/choose an element/i)
  const input = wrapper.getByTestId(dataTestIds.input)
  const menu = wrapper.getByRole('listbox')
  const getItemFromText = text => wrapper.getByText(text)
  const getItems = () => wrapper.getAllByRole('option')

  return {wrapper, combobox, label, input, menu, getItemFromText, getItems}
}

const renderUseDropdown = props => {
  const wrapper = renderHook(() => useDropdown({items, ...props}))

  return {wrapper, ...wrapper.result.current}
}

export {renderUseDropdown, defaultIds, items, renderCombobox}
