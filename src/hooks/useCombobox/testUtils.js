import React from 'react'
import {render} from '@testing-library/react'
import {renderHook} from '@testing-library/react-hooks'
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
  menu: 'menu-id',
  item: index => `item-id-${index}`,
  input: 'input-id',
  combobox: 'combobox-id',
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

const setup = props => render(<DropdownCombobox {...props} />)

const setupHook = props => {
  return renderHook(() => useCombobox({items, ...props}))
}

export {setupHook, dataTestIds, defaultIds, items, setup}
