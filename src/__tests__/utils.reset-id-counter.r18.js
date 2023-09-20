import * as React from 'react'
import {render, screen} from '@testing-library/react'
import Downshift from '..'
import {resetIdCounter} from '../utils'

afterAll(() => {
  jest.restoreAllMocks()
})

test('renders with correct and predictable auto generated id upon resetIdCounter call', () => {
  jest.spyOn(console, 'warn').mockImplementation(() => {})

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

  setup({renderDownshift})
  resetIdCounter()

  expect(console.warn).toHaveBeenCalledTimes(1)
  expect(console.warn).toHaveBeenCalledWith(
    'It is not necessary to call resetIdCounter when using React 18+',
  )
})

function setup({renderDownshift = () => <div />, ...props} = {}) {
  let renderArg
  const childrenSpy = jest.fn(controllerArg => {
    renderArg = controllerArg
    return renderDownshift(controllerArg)
  })
  const utils = render(<Downshift {...props}>{childrenSpy}</Downshift>)
  const input = screen.queryByTestId('input')
  const label = screen.queryByTestId('label')
  const item = screen.queryByTestId('item-0')
  return {...utils, input, label, item, ...renderArg}
}
