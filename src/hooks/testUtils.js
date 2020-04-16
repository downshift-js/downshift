import {act} from '@testing-library/react'

export const items = [
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

export const defaultIds = {
  labelId: 'downshift-test-id-label',
  menuId: 'downshift-test-id-menu',
  getItemId: index => `downshift-test-id-item-${index}`,
  toggleButtonId: 'downshift-test-id-toggle-button',
  inputId: 'downshift-test-id-input',
}

export const waitForDebouncedA11yStatusUpdate = () => {
  act(() => jest.advanceTimersByTime(200))
}
