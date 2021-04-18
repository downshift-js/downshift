import * as React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Downshift from '../'

test('focus restored upon item mouse click', () => {
  renderDownshift(['A', 'B'])
  const inputNode = screen.getByRole(`textbox`)
  const buttonNode = screen.getByRole('button')
  const item = screen.queryByTestId('A')

  expect(document.activeElement.nodeName).toEqual('BODY')

  inputNode.focus()
  expect(inputNode).toHaveFocus()

  userEvent.click(item)
  expect(inputNode).toHaveFocus()

  buttonNode.focus()
  expect(buttonNode).toHaveFocus()

  userEvent.click(item)
  expect(buttonNode).toHaveFocus()
})

function renderDownshift(items) {
  const id = 'languages[0].name'

  return render(
    <Downshift id={id}>
      {({getInputProps, getItemProps, getToggleButtonProps}) => (
        <div>
          <input {...getInputProps()} />
          <button {...getToggleButtonProps()} />
          <div>
            {items.map(item => (
              <div data-testid={item} key={item} {...getItemProps({item})}>
                {item}
              </div>
            ))}
          </div>
        </div>
      )}
    </Downshift>,
  )
}
