import React from 'react'
import {mount} from 'enzyme'
import Downshift from '../'
import setA11yStatus from '../set-a11y-status'

jest.useFakeTimers()
jest.mock('../set-a11y-status')

test('handles mouse events properly to reset state', () => {
  const handleStateChange = jest.fn()
  const MyComponent = () =>
    (<Downshift onStateChange={handleStateChange}>
      {({getInputProps}) =>
        (<div>
          <input {...getInputProps({'data-test': 'input'})} />
        </div>)}
    </Downshift>)
  const wrapper = mount(<MyComponent />)
  const inputWrapper = wrapper.find(sel('input'))
  const node = wrapper.getDOMNode().parentNode
  document.body.appendChild(node)

  // open the menu
  inputWrapper.simulate('keydown', {key: 'ArrowDown'})
  handleStateChange.mockClear()

  const inputNode = inputWrapper.getDOMNode()

  mouseDownAndUp(inputNode)
  expect(handleStateChange).toHaveBeenCalledTimes(0)

  mouseDownAndUp(document.body)
  expect(handleStateChange).toHaveBeenCalledTimes(1)

  // calls our state change handler it every time
  mouseDownAndUp(document.body)
  expect(handleStateChange).toHaveBeenCalledTimes(1)

  // cleans up
  wrapper.unmount()
  mouseDownAndUp(document.body)
  expect(handleStateChange).toHaveBeenCalledTimes(1)
})

test('props update causes the a11y status to be updated', () => {
  setA11yStatus.mockReset()
  const MyComponent = () =>
    (<Downshift isOpen={false}>
      {({getInputProps, getItemProps, isOpen}) =>
        (<div>
          <input {...getInputProps({'data-test': 'input'})} />
          {isOpen ? <div {...getItemProps({item: 'foo', index: 0})} /> : null}
        </div>)}
    </Downshift>)
  const wrapper = mount(<MyComponent />)
  wrapper.setProps({isOpen: true})
  jest.runAllTimers()
  expect(setA11yStatus).toHaveBeenCalledTimes(1)
  wrapper.setProps({isOpen: false})
  wrapper.unmount()
  jest.runAllTimers()
  expect(setA11yStatus).toHaveBeenCalledTimes(1)
})

function mouseDownAndUp(node) {
  node.dispatchEvent(new window.MouseEvent('mousedown', {bubbles: true}))
  node.dispatchEvent(new window.MouseEvent('mouseup', {bubbles: true}))
}

function sel(id) {
  return `[data-test="${id}"]`
}
