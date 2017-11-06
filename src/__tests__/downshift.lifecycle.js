import React from 'react'
import {mount} from 'enzyme'
import Downshift from '../'
import setA11yStatus from '../set-a11y-status'

jest.useFakeTimers()
jest.mock('../set-a11y-status')

test('handles mouse events properly to reset state', () => {
  const handleStateChange = jest.fn()
  const childSpy = jest.fn(({getInputProps}) => (
    <div>
      <input {...getInputProps({'data-test': 'input'})} />
    </div>
  ))
  const MyComponent = () => (
    <Downshift onStateChange={handleStateChange}>{childSpy}</Downshift>
  )
  const wrapper = mount(<MyComponent />)
  const inputWrapper = wrapper.find(sel('input'))
  const node = wrapper.getDOMNode().parentNode
  document.body.appendChild(node)

  // open the menu
  inputWrapper.simulate('keydown', {key: 'ArrowDown'})
  handleStateChange.mockClear()

  const inputNode = inputWrapper.getDOMNode()

  // mouse down and up on within the autocomplete node
  mouseDownAndUp(inputNode)
  expect(handleStateChange).toHaveBeenCalledTimes(0)

  // mouse down and up on outside the autocomplete node
  mouseDownAndUp(document.body)
  expect(handleStateChange).toHaveBeenCalledTimes(1)

  childSpy.mockClear()
  // does not call our state change handler when no state changes
  mouseDownAndUp(document.body)
  expect(handleStateChange).toHaveBeenCalledTimes(1)
  // does not rerender when no state changes
  expect(childSpy).not.toHaveBeenCalled()

  // cleans up
  wrapper.unmount()
  mouseDownAndUp(document.body)
  expect(handleStateChange).toHaveBeenCalledTimes(1)
})

test('props update causes the a11y status to be updated', () => {
  setA11yStatus.mockReset()
  const MyComponent = () => (
    <Downshift isOpen={false}>
      {({getInputProps, getItemProps, isOpen}) => (
        <div>
          <input {...getInputProps({'data-test': 'input'})} />
          {isOpen ? <div {...getItemProps({item: 'foo', index: 0})} /> : null}
        </div>
      )}
    </Downshift>
  )
  const wrapper = mount(<MyComponent />)
  wrapper.setProps({isOpen: true})
  jest.runAllTimers()
  expect(setA11yStatus).toHaveBeenCalledTimes(1)
  wrapper.setProps({isOpen: false})
  wrapper.unmount()
  jest.runAllTimers()
  expect(setA11yStatus).toHaveBeenCalledTimes(1)
})

test('inputValue initializes properly if the selectedItem is controlled and set', () => {
  const childSpy = jest.fn(() => null)
  mount(<Downshift selectedItem={'foo'}>{childSpy}</Downshift>)
  expect(childSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      inputValue: 'foo',
    }),
  )
})

test('props update of selectedItem will update the inputValue state', () => {
  const childSpy = jest.fn(() => null)
  const wrapper = mount(<Downshift selectedItem={null}>{childSpy}</Downshift>)
  childSpy.mockClear()
  wrapper.setProps({selectedItem: 'foo'})
  expect(childSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      inputValue: 'foo',
    }),
  )
})

test('props update of selectedItem will not update inputValue state', () => {
  const childSpy = jest.fn(() => null)
  const wrapper = mount(
    <Downshift
      onInputValueChange={childSpy}
      selectedItemChanged={(prevItem, item) => prevItem.id !== item.id}
      selectedItem={{id: '123', value: 'wow'}}
    >
      {() => null}
    </Downshift>,
  )
  childSpy.mockClear()
  wrapper.setProps({selectedItem: {id: '123', value: 'not wow'}})
  expect(childSpy).not.toHaveBeenCalled()
})

function mouseDownAndUp(node) {
  node.dispatchEvent(new window.MouseEvent('mousedown', {bubbles: true}))
  node.dispatchEvent(new window.MouseEvent('mouseup', {bubbles: true}))
}

function sel(id) {
  return `[data-test="${id}"]`
}
