import * as React from 'react'
import {render, fireEvent} from '@testing-library/react'
import Downshift from '../'

test('focus restored upon item mouse click', () => {
  const {queryByTestId, container} = renderDownshift(['A', 'B'])
  const inputNode = container.querySelector(`input`)
  const buttonNode = container.querySelector('button')
  const item = queryByTestId('A')

  expect(document.activeElement.nodeName).toEqual('BODY')

  inputNode.focus()
  expect(document.activeElement).toBe(inputNode)

  fireEvent.click(item)
  expect(document.activeElement).toBe(inputNode)

  buttonNode.focus()
  expect(document.activeElement).toBe(buttonNode)

  fireEvent.click(item)
  expect(document.activeElement).toBe(buttonNode)
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
