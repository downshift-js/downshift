import {screen, act} from '@testing-library/react'
import type userEvent from '@testing-library/user-event'
import {dataTestIds} from './fixtures'

export const waitForDebouncedA11yStatusUpdate = (shouldBeCleared = false) =>
  act(() => jest.advanceTimersByTime(shouldBeCleared ? 700 : 200))

type UserEvent = ReturnType<typeof userEvent.setup>

export function getLabel() {
  return screen.getByText(/choose an element/i)
}
export function getMenu() {
  return screen.getByRole('listbox')
}
export function getToggleButton() {
  return screen.getByTestId(dataTestIds.toggleButton)
}
export function getItemAtIndex(index: number) {
  return getItems()[index]
}
export function getItems() {
  return screen.queryAllByRole('option')
}
export async function clickOnItemAtIndex(user: UserEvent, index: number) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  await user.click(getItemAtIndex(index)!)
}
export async function clickOnToggleButton(user: UserEvent) {
  await user.click(getToggleButton())
}
export async function mouseMoveItemAtIndex(user: UserEvent, index: number) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  await user.hover(getItemAtIndex(index)!)
}
export async function mouseLeaveItemAtIndex(user: UserEvent, index: number) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  await user.unhover(getItemAtIndex(index)!)
}
export async function keyDownOnToggleButton(user: UserEvent, keys: string) {
  if (document.activeElement !== getToggleButton()) {
    getToggleButton().focus()
  }

  await user.keyboard(keys)
}
export function getA11yStatusContainer() {
  return screen.queryByRole('status')
}
export async function tab(user: UserEvent, shiftKey = false) {
  await user.tab({shift: shiftKey})
}
