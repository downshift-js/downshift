import * as React from 'react'
import {render} from '@testing-library/react'
import Downshift from '../'
import {resetIdCounter} from '../utils'

test('renders with correct and predictable auto generated id upon resetIdCounter call', () => {
  resetIdCounter()

  const renderDownshift = ({getInputProps, getLabelProps, getItemProps}) => (
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

  const setup1 = setup({renderDownshift})
  expect(setup1.id).toBe('downshift-0')
  expect(setup1.label.getAttribute('for')).toBe('downshift-0-input')
  expect(setup1.input.getAttribute('id')).toBe('downshift-0-input')
  expect(setup1.item.getAttribute('id')).toBe('downshift-0-item-0')
  setup1.unmount()

  const setup2 = setup({renderDownshift})
  expect(setup2.id).toBe('downshift-1')
  expect(setup2.label.getAttribute('for')).toBe('downshift-1-input')
  expect(setup2.input.getAttribute('id')).toBe('downshift-1-input')
  expect(setup2.item.getAttribute('id')).toBe('downshift-1-item-0')
  setup2.unmount()

  resetIdCounter()

  const setup3 = setup({renderDownshift})
  expect(setup3.id).toBe('downshift-0')
  expect(setup3.label.getAttribute('for')).toBe('downshift-0-input')
  expect(setup3.input.getAttribute('id')).toBe('downshift-0-input')
  expect(setup3.item.getAttribute('id')).toBe('downshift-0-item-0')
  setup3.unmount()
})

function setup({renderDownshift = () => <div />, ...props} = {}) {
  let renderArg
  const childrenSpy = jest.fn(controllerArg => {
    renderArg = controllerArg
    return renderDownshift(controllerArg)
  })
  const utils = render(<Downshift {...props}>{childrenSpy}</Downshift>)
  const input = utils.queryByTestId('input')
  const label = utils.queryByTestId('label')
  const item = utils.queryByTestId('item-0')
  return {...utils, input, label, item, ...renderArg}
}
