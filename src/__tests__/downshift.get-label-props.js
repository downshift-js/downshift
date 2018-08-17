import 'react-testing-library/cleanup-after-each'
import React from 'react'
import {render} from 'react-testing-library'
import Downshift from '../'

beforeEach(() => jest.spyOn(console, 'error').mockImplementation(() => {}))
afterEach(() => console.error.mockRestore())

test('label "for" attribute is set to the input "id" attribute', () => {
  const {label, input} = renderDownshift()
  expect(label.getAttribute('for')).toBeDefined()
  expect(label.getAttribute('for')).toBe(input.getAttribute('id'))
})

test('when the inputId prop is set, the label for is set to it', () => {
  const id = 'foo'
  const {label, input} = renderDownshift({
    props: {inputId: id},
  })
  expect(label.getAttribute('for')).toBe(id)
  expect(label.getAttribute('for')).toBe(input.getAttribute('id'))
})

function renderDownshift({props} = {}) {
  const utils = render(<BasicDownshift {...props} />)
  return {
    ...utils,
    input: utils.queryByTestId('input'),
    label: utils.queryByTestId('label'),
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
