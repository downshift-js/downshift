import React from 'react'
import {mount} from 'enzyme'
import Downshift from '../'

test('space on button opens and closes the menu', () => {
  const {Component, childSpy} = setup()
  const wrapper = mount(<Component />)
  const button = wrapper.find('button')
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
  const {Component, childSpy} = setup()
  const wrapper = mount(<Component />)
  const button = wrapper.find('button')
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
  const {Component, childSpy} = setup()
  const wrapper = mount(<Component />)
  const button = wrapper.find('button')
  childSpy.mockClear()
  button.simulate('keydown', {key: 's'})
  expect(childSpy).not.toHaveBeenCalled()
})

test('getButtonProps returns all given props', () => {
  const buttonProps = {'data-foo': 'bar'}
  const Button = jest.fn(props => <button {...props} />)
  mount(
    <Downshift>
      {({getButtonProps}) => (
        <div>
          <Button {...getButtonProps(buttonProps)} />
        </div>
      )}
    </Downshift>,
  )
  expect(Button).toHaveBeenCalledTimes(1)
  const context = expect.any(Object)
  expect(Button).toHaveBeenCalledWith(
    expect.objectContaining(buttonProps),
    context,
  )
})

function setup() {
  const childSpy = jest.fn(({getButtonProps}) => (
    <div>
      <button {...getButtonProps()} />
    </div>
  ))
  return {
    Component: props => <Downshift {...props}>{childSpy}</Downshift>,
    childSpy,
  }
}
