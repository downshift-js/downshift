import React from 'react'
import {act} from '@testing-library/react'

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
  labelId: 'downshift-test-id-label',
  menuId: 'downshift-test-id-menu',
  getItemId: index => `downshift-test-id-item-${index}`,
  toggleButtonId: 'downshift-test-id-toggle-button',
  inputId: 'downshift-test-id-input',
  ariaControls: 'downshift-test-id',
}

const waitForDebouncedA11yStatusUpdate = () =>
  act(() => jest.advanceTimersByTime(200))

const MemoizedItem = React.memo(function Item({
  index,
  item,
  getItemProps,
  dataTestIds,
  stringItem,
  ...rest
}) {
  return (
    <li
      data-testid={dataTestIds.item(index)}
      key={`${stringItem}${index}`}
      {...getItemProps({item, index, ...rest})}
    >
      {stringItem}
    </li>
  )
})

export {items, defaultIds, waitForDebouncedA11yStatusUpdate, MemoizedItem}
