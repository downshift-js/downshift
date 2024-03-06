import React from 'react'
import {screen, act} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

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

export const dataTestIds = {
  toggleButton: 'toggle-button-id',
  menu: 'menu-id',
  item: index => `item-id-${index}`,
  input: 'input-id',
  selectedItemPrefix: 'selected-item-id',
  selectedItem: index => `selected-item-id-${index}`,
}

export const defaultIds = {
  labelId: 'downshift-test-id-label',
  menuId: 'downshift-test-id-menu',
  getItemId: index => `downshift-test-id-item-${index}`,
  toggleButtonId: 'downshift-test-id-toggle-button',
  inputId: 'downshift-test-id-input',
}

export const waitForDebouncedA11yStatusUpdate = (shouldBeCleared = false) =>
  act(() => jest.advanceTimersByTime(shouldBeCleared ? 500 : 200))

export const MemoizedItem = React.memo(function Item({
  index,
  item,
  getItemProps,
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

export const user = userEvent.setup({delay: null})

export function getLabel() {
  return screen.getByText(/choose an element/i)
}
export function getMenu() {
  return screen.getByRole('listbox')
}
export function getToggleButton() {
  return screen.getByTestId(dataTestIds.toggleButton)
}
export function getItemAtIndex(index) {
  return getItems()[index]
}
export function getItems() {
  return screen.queryAllByRole('option')
}
export async function clickOnItemAtIndex(index) {
  await user.click(getItemAtIndex(index))
}
export async function clickOnToggleButton() {
  await user.click(getToggleButton())
}
export async function mouseMoveItemAtIndex(index) {
  await user.hover(getItemAtIndex(index))
}
export async function mouseLeaveItemAtIndex(index) {
  await user.unhover(getItemAtIndex(index))
}
export async function keyDownOnToggleButton(keys) {
  if (document.activeElement !== getToggleButton()) {
    getToggleButton().focus()
  }

  await user.keyboard(keys)
}
export function getA11yStatusContainer() {
  return screen.queryByRole('status')
}
export async function tab(shiftKey = false) {
  await user.tab({shift: shiftKey})
}

// format is: [initialIsOpen, defaultIsOpen, props.isOpen]
export const initialFocusAndOpenTestCases = [
  [undefined, undefined, true, true],
  [true, true, true, true],
  [true, false, true, true],
  [false, true, true, true],
  [false, false, true, true],
  [true, undefined, undefined, true],
  [true, false, undefined, true],
  [true, true, undefined, true],
  [undefined, true, undefined, true],
]

// format is: [initialIsOpen, defaultIsOpen, props.isOpen]
export const initialNoFocusOrOpenTestCases = [
  [undefined, undefined, undefined, false],
  [undefined, undefined, false, false],
  [true, true, false, false],
  [true, false, false, false],
  [false, true, false, false],
  [false, false, false, false],
  [false, undefined, undefined, false],
  [false, false, undefined, false],
  [false, true, undefined, false],
  [undefined, false, undefined, false],
]
