import React from 'react'
import {mount} from 'enzyme'
import Downshift from '../'

test('space on button opens and closes the menu', () => {
  const {button, childSpy} = setup()
  button.simulate('keydown', {key: ' '})
  expect(childSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({isOpen: true}),
  )
  button.simulate('keydown', {key: ' '})
  expect(childSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({isOpen: false}),
  )
})

test('clicking on the button opens and closes the menu', () => {
  const {button, childSpy} = setup()
  button.simulate('click')
  expect(childSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({isOpen: true}),
  )
  button.simulate('click')
  expect(childSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({isOpen: false}),
  )
})

test('button ignores key events it does not handle', () => {
  const {button, childSpy} = setup()
  childSpy.mockClear()
  button.simulate('keydown', {key: 's'})
  expect(childSpy).not.toHaveBeenCalled()
})

test('getButtonProps returns all given props', () => {
  const buttonProps = {'data-foo': 'bar'}
  const Button = jest.fn(props => <button {...props} />)
  setup({buttonProps, Button})
  expect(Button).toHaveBeenCalledTimes(1)
  const context = expect.any(Object)
  expect(Button).toHaveBeenCalledWith(
    expect.objectContaining(buttonProps),
    context,
  )
})

// normally this test would be like the others where we render and then simulate a click on the
// button to ensure that a disabled button cannot be clicked, however this is only a problem in IE11
// so we have to get into the implementation details a little bit (unless we want to run these tests
// in IE11... no thank you 🙅)
test(`getButtonProps doesn't include event handlers when disabled is passed (for IE11 support)`, () => {
  const {getButtonProps} = setup()
  const props = getButtonProps({disabled: true})
  const entry = Object.entries(props).find(
    ([_key, value]) => typeof value === 'function',
  )
  if (entry) {
    throw new Error(
      `getButtonProps should not have any props that are callbacks. It has ${
        entry[0]
      }.`,
    )
  }
})

function setup({buttonProps, Button = props => <button {...props} />} = {}) {
  let renderArg
  const childSpy = jest.fn(controllerArg => {
    renderArg = controllerArg
    return (
      <div>
        <Button {...controllerArg.getButtonProps(buttonProps)} />
      </div>
    )
  })
  const wrapper = mount(<Downshift>{childSpy}</Downshift>)
  const button = wrapper.find('button')
  return {button, childSpy, ...renderArg}
}
