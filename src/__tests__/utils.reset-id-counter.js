import React from 'react'
import {render as renderToDOM} from 'react-testing-library'
import Downshift from '../'
import {resetIdCounter} from '../utils'

test('renders with correct and predictable auto generated id upon resetIdCounter call', () => {
  resetIdCounter()

  const render = ({getInputProps, getLabelProps, getItemProps}) => (
    <div>
      <label data-testid="label" {...getLabelProps()} />
      <input data-testid="input" {...getInputProps()} />
      <div>
        <span
          {...getItemProps({
            item: 0,
            'data-testid': 'item-0',
          })}
        >
          0
        </span>
      </div>
    </div>
  )

  const setup1 = setup({render})
  expect(setup1.id).toBe('downshift-0')
  expect(setup1.label.getAttribute('for')).toBe('downshift-0-input')
  expect(setup1.input.getAttribute('id')).toBe('downshift-0-input')
  expect(setup1.item.getAttribute('id')).toBe('downshift-0-item-0')

  const setup2 = setup({render})
  expect(setup2.id).toBe('downshift-1')
  expect(setup2.label.getAttribute('for')).toBe('downshift-1-input')
  expect(setup2.input.getAttribute('id')).toBe('downshift-1-input')
  expect(setup2.item.getAttribute('id')).toBe('downshift-1-item-0')

  resetIdCounter()

  const setup3 = setup({render})
  expect(setup3.id).toBe('downshift-0')
  expect(setup3.label.getAttribute('for')).toBe('downshift-0-input')
  expect(setup3.input.getAttribute('id')).toBe('downshift-0-input')
  expect(setup3.item.getAttribute('id')).toBe('downshift-0-item-0')
})

function setup({render = () => <div />, ...props} = {}) {
  let renderArg
  const childrenSpy = jest.fn(controllerArg => {
    renderArg = controllerArg
    return render(controllerArg)
  })
  const domUtils = renderToDOM(<Downshift {...props}>{childrenSpy}</Downshift>)
  const input = domUtils.queryByTestId('input')
  const label = domUtils.queryByTestId('label')
  const item = domUtils.queryByTestId('item-0')
  return {input, label, item, ...domUtils, ...renderArg}
}
