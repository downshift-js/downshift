import React from 'react'
import {render} from 'react-testing-library'
import Downshift from '../'

beforeEach(() => {
  jest.spyOn(console, 'error')
  console.error.mockImplementation(() => {})
})

afterEach(() => {
  console.error.mockRestore()
})

test('label "for" attribute is set to the input "id" attribute', () => {
  const {label, input} = renderDownshift()
  expect(label.getAttribute('for')).toBeDefined()
  expect(label.getAttribute('for')).toBe(input.getAttribute('id'))
})

test('when the input id is set, the label for is set to it', () => {
  const id = 'foo'
  const {label, input} = renderDownshift({props: {inputProps: {id}}})
  expect(label.getAttribute('for')).toBe(id)
  expect(label.getAttribute('for')).toBe(input.getAttribute('id'))
})

test('when the input id is set, and the label for is set to something else, an error is thrown', () => {
  expect(() =>
    render(
      <BasicDownshift inputProps={{id: 'foo'}} labelProps={{htmlFor: 'bar'}} />,
    ),
  ).toThrowErrorMatchingSnapshot()
})

test('when the label for is set, and the input id is set to something else, an error is thrown', () => {
  expect(() =>
    render(
      <BasicDownshift
        getLabelPropsFirst
        inputProps={{id: 'foo'}}
        labelProps={{htmlFor: 'bar'}}
      />,
    ),
  ).toThrowErrorMatchingSnapshot()
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
    <Downshift
      {...rest}
      render={({getInputProps, getLabelProps}) => {
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
    />
  )
}
