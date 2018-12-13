import 'react-testing-library/cleanup-after-each'
import React from 'react'
import {render, fireEvent} from 'react-testing-library'
import Downshift from '../'

jest.useFakeTimers()

test('space on button opens and closes the menu', () => {
  const {button, childrenSpy} = setup()
  fireEvent.keyDown(button, {key: ' '})
  fireEvent.keyUp(button, {key: ' '})
  expect(childrenSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({isOpen: true}),
  )
  fireEvent.keyDown(button, {key: ' '})
  fireEvent.keyUp(button, {key: ' '})
  expect(childrenSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({isOpen: false}),
  )
})

test('clicking on the button opens and closes the menu', () => {
  const {button, childrenSpy} = setup()
  fireEvent.click(button)
  expect(childrenSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({isOpen: true}),
  )
  fireEvent.click(button)
  expect(childrenSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({isOpen: false}),
  )
})

test('button ignores key events it does not handle', () => {
  const {button, childrenSpy} = setup()
  childrenSpy.mockClear()
  fireEvent.keyDown(button, {key: 's'})
  expect(childrenSpy).not.toHaveBeenCalled()
})

test('on button blur resets the state', () => {
  const {button, childrenSpy} = setup()
  fireEvent.blur(button)
  jest.runAllTimers()
  expect(childrenSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({
      isOpen: false,
    }),
  )
})

test('on button blur does not reset the state when the mouse is down', () => {
  const {button, childrenSpy} = setup()
  childrenSpy.mockClear()
  // mousedown somwhere
  fireEvent.mouseDown(document.body)
  fireEvent.blur(button)
  jest.runAllTimers()
  expect(childrenSpy).not.toHaveBeenCalled()
})

test('getToggleButtonProps returns all given props', () => {
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
test(`getToggleButtonProps doesn't include event handlers when disabled is passed (for IE11 support)`, () => {
  const {getToggleButtonProps} = setup()
  const props = getToggleButtonProps({disabled: true})
  const entry = Object.entries(props).find(
    ([_key, value]) => typeof value === 'function',
  )
  if (entry) {
    throw new Error(
      `getToggleButtonProps should not have any props that are callbacks. It has ${
        entry[0]
      }.`,
    )
  }
})

test('stops key events that downshift has handled from propagating', () => {
  const keyDownSpy = jest.fn()
  const {container} = render(
    <div onKeyDown={keyDownSpy}>
      <Downshift isOpen highlightedIndex={1}>
        {({getToggleButtonProps}) => <button {...getToggleButtonProps()} />}
      </Downshift>
    </div>,
  )

  const button = container.querySelector('button')

  fireEvent.keyDown(button, {key: 'ArrowDown'})
  fireEvent.keyDown(button, {key: 'ArrowUp'})
  fireEvent.keyDown(button, {key: 'Enter'})
  fireEvent.keyDown(button, {key: 'Escape'})

  expect(keyDownSpy).toHaveBeenCalledTimes(0)
})

describe('Expect timer to trigger on process.env.NODE_ENV !== test value', () => {
  const originalEnv = process.env.NODE_ENV

  afterEach(() => {
    process.env.NODE_ENV = originalEnv
  })

  test('clicking on the button opens and closes the menu for test', () => {
    process.env.NODE_ENV = 'production'
    const {button, childrenSpy} = setup()
    fireEvent.click(button)
    jest.runAllTimers()
    expect(childrenSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({isOpen: true}),
    )
    fireEvent.click(button)
    jest.runAllTimers()
    expect(childrenSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({isOpen: false}),
    )
  })
})

function setup({buttonProps, Button = props => <button {...props} />} = {}) {
  let renderArg
  const childrenSpy = jest.fn(controllerArg => {
    renderArg = controllerArg
    return (
      <div>
        <Button {...controllerArg.getToggleButtonProps(buttonProps)} />
      </div>
    )
  })
  const utils = render(<Downshift>{childrenSpy}</Downshift>)
  const button = utils.container.querySelector('button')
  return {...utils, button, childrenSpy, ...renderArg}
}
