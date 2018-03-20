import React from 'react'
import {render, Simulate} from 'react-testing-library'
import Downshift from '../'

test('focus restored upon item mouse click', () => {
  const {queryByTestId, container} = renderDownshift(['A', 'B'])
  const inputNode = container.querySelector(`input`)
  const buttonNode = container.querySelector('button')
  const item = queryByTestId('A')

  expect(document.activeElement.nodeName).toEqual('BODY')

  inputNode.focus()
  expect(document.activeElement).toBe(inputNode)

  Simulate.click(item)
  expect(document.activeElement).toBe(inputNode)

  buttonNode.focus()
  expect(document.activeElement).toBe(buttonNode)

  Simulate.click(item)
  expect(document.activeElement).toBe(buttonNode)
})

function renderDownshift(items) {
  const id = 'languages[0].name'

  return render(
    <Downshift
      id={id}
      render={({getInputProps, getItemProps, getButtonProps}) => (
        <div>
          <input {...getInputProps()} />
          <button {...getButtonProps()} />
          <div>
            {items.map(item => (
              <div data-testid={item} key={item} {...getItemProps({item})}>
                {item}
              </div>
            ))}
          </div>
        </div>
      )}
    />,
  )
}
