import * as React from 'react'
import {render, fireEvent, screen} from '@testing-library/react'
import Downshift from '../'

test('focus restored upon item mouse click', () => {
  const {container} = renderDownshift(['A', 'B'])
  const inputNode = container.querySelector(`input`)
  const buttonNode = container.querySelector('button')
  const item = screen.queryByTestId('A')

  expect(document.activeElement.nodeName).toEqual('BODY')

  inputNode.focus()
  expect(inputNode).toHaveFocus()

  fireEvent.click(item)
  expect(inputNode).toHaveFocus()

  buttonNode.focus()
  expect(buttonNode).toHaveFocus()

  fireEvent.click(item)
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
