import type userEvent from '@testing-library/user-event'
import {getInput} from './renderCombobox'

type UserEvent = ReturnType<typeof userEvent.setup>

export async function keyDownOnInput(user: UserEvent, keys: string) {
  if (document.activeElement !== getInput()) {
    getInput().focus()
  }

  await user.keyboard(keys)
}

export async function changeInputValue(user: UserEvent, inputValue: string) {
  if (document.activeElement !== getInput()) {
    getInput().focus()
  }

  await user.keyboard(inputValue)
}

export async function clickOnInput(user: UserEvent) {
  await user.click(getInput())
}
