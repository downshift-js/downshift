import * as React from 'react'
import {render, screen} from '@testing-library/react'
import Downshift from '../'

beforeEach(() => jest.spyOn(console, 'error').mockImplementation(() => {}))
afterEach(() => console.error.mockRestore())

test('label "for" attribute is set to the input "id" attribute', () => {
  const {label, input} = renderDownshift()
  expect(label).toHaveAttribute('for', input.getAttribute('id'))
})

test('when the inputId prop is set, the label for is set to it', () => {
  const id = 'foo'
  const {label, input} = renderDownshift({
    props: {inputId: id},
  })
  expect(label).toHaveAttribute('for', input.getAttribute('id'))
  expect(label).toHaveAttribute('for', id)
})

function renderDownshift({props} = {}) {
  const utils = render(<BasicDownshift {...props} />)
  return {
    ...utils,
    input: screen.queryByTestId('input'),
    label: screen.queryByTestId('label'),
  }
}

function BasicDownshift({
  inputProps,
  labelProps,
  getLabelPropsFirst = false,
  ...rest
}) {
  return (
    <Downshift {...rest}>
      {({getInputProps, getLabelProps}) => {
        if (getLabelPropsFirst) {
          labelProps = getLabelProps(labelProps)
          inputProps = getInputProps(inputProps)
        } else {
          inputProps = getInputProps(inputProps)
          labelProps = getLabelProps(labelProps)
        }
        return (
          <div>
            <input data-testid="input" {...inputProps} />
            <label data-testid="label" {...labelProps} />
          </div>
        )
      }}
    </Downshift>
  )
}
