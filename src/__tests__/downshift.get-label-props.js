import React from 'react'
import {mount} from 'enzyme'
import Downshift from '../'

test('label "for" attribute is set to the input "id" attribute', () => {
  const wrapper = mount(<BasicDownshift />)
  const label = wrapper.find('label').first()
  const input = wrapper.find('input').first()
  expect(label.node.getAttribute('for')).toBeDefined()
  expect(label.node.getAttribute('for')).toBe(input.node.getAttribute('id'))
})

test('when the input id is set, the label for is set to it', () => {
  const id = 'foo'
  const wrapper = mount(<BasicDownshift inputProps={{id}} />)
  const label = wrapper.find('label').first()
  const input = wrapper.find('input').first()
  expect(label.node.getAttribute('for')).toBe(id)
  expect(label.node.getAttribute('for')).toBe(input.node.getAttribute('id'))
})

test('when the input id is set, and the label for is set to something else, an error is thrown', () => {
  expect(() =>
    mount(
      <BasicDownshift inputProps={{id: 'foo'}} labelProps={{htmlFor: 'bar'}} />,
    ),
  ).toThrowErrorMatchingSnapshot()
})

test('when the label for is set, and the input id is set to something else, an error is thrown', () => {
  expect(() =>
    mount(
      <BasicDownshift
        getLabelPropsFirst
        inputProps={{id: 'foo'}}
        labelProps={{htmlFor: 'bar'}}
      />,
    ),
  ).toThrowErrorMatchingSnapshot()
})

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
            <input {...inputProps} />
            <label {...labelProps} />
          </div>
        )
      }}
    </Downshift>
  )
}
