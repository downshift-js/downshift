// this is stuff that I couldn't think fit anywhere else
// but we still want to have tested.

import React from 'react'
import {mount} from 'enzyme'
import Downshift from '../'

test('onStateChange called with changes and downshift state and helpers', () => {
  const handleStateChange = jest.fn()
  const controlledState = {
    inputValue: '',
    selectedItem: null,
  }
  const {selectItem} = setup({
    ...controlledState,
    onStateChange: handleStateChange,
  })
  const itemToSelect = 'foo'
  selectItem(itemToSelect)
  const changes = {
    type: Downshift.stateChangeTypes.unknown,
    selectedItem: itemToSelect,
    inputValue: itemToSelect,
  }
  const stateAndHelpers = {
    ...controlledState,
    isOpen: false,
    highlightedIndex: null,
    selectItem,
  }
  expect(handleStateChange).toHaveBeenLastCalledWith(
    changes,
    expect.objectContaining(stateAndHelpers),
  )
})

test('onChange called when clearSelection is trigered', () => {
  const handleChange = jest.fn()
  const {clearSelection} = setup({
    selectedItem: 'foo',
    onChange: handleChange,
  })
  clearSelection()
  expect(handleChange).toHaveBeenCalledTimes(1)
  expect(handleChange).toHaveBeenCalledWith(null, expect.any(Object))
})

test('onChange only called when the selection changes', () => {
  const handleChange = jest.fn()
  const {selectItem} = setup({
    onChange: handleChange,
  })
  selectItem('foo')
  expect(handleChange).toHaveBeenCalledTimes(1)
  expect(handleChange).toHaveBeenCalledWith('foo', expect.any(Object))
  handleChange.mockClear()
  selectItem('foo')
  expect(handleChange).toHaveBeenCalledTimes(0)
})

test('uses given environment', () => {
  const environment = {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    document: {
      getElementById: jest.fn(() => document.createElement('div')),
    },
  }
  const {wrapper, setHighlightedIndex} = setup({environment})
  setHighlightedIndex()
  wrapper.unmount()
  expect(environment.addEventListener).toHaveBeenCalledTimes(2)
  expect(environment.removeEventListener).toHaveBeenCalledTimes(2)
  expect(environment.document.getElementById).toHaveBeenCalledTimes(1)
})

test('can override onOuterClick callback to maintain isOpen state', () => {
  const children = () => <div />
  const onOuterClick = jest.fn()
  const {openMenu} = setup({children, onOuterClick})
  openMenu()
  mouseDownAndUp(document.body)
  expect(onOuterClick).toHaveBeenCalledTimes(1)
  expect(onOuterClick).toHaveBeenCalledWith(
    expect.objectContaining({
      // just verify that it's the controller object
      isOpen: false,
      getItemProps: expect.any(Function),
    }),
  )
})

test('onInputValueChange called when changes contain inputValue', () => {
  const handleInputValueChange = jest.fn()
  const {selectItem} = setup({
    onInputValueChange: handleInputValueChange,
  })
  selectItem('foo')
  expect(handleInputValueChange).toHaveBeenCalledTimes(1)
  expect(handleInputValueChange).toHaveBeenCalledWith('foo', expect.any(Object))
})

test('onInputValueChange not called when changes do not contain inputValue', () => {
  const handleInputValueChange = jest.fn()
  const {openMenu} = setup({
    onInputValueChange: handleInputValueChange,
  })
  openMenu()

  expect(handleInputValueChange).toHaveBeenCalledTimes(0)
})

test('onInputValueChange called with empty string on reset', () => {
  const handleInputValueChange = jest.fn()
  const {reset} = setup({
    onInputValueChange: handleInputValueChange,
  })
  reset()
  expect(handleInputValueChange).toHaveBeenCalledTimes(1)
  expect(handleInputValueChange).toHaveBeenCalledWith('', expect.any(Object))
})

function mouseDownAndUp(node) {
  node.dispatchEvent(new window.MouseEvent('mousedown', {bubbles: true}))
  node.dispatchEvent(new window.MouseEvent('mouseup', {bubbles: true}))
}

function setup({children = () => <div />, ...props} = {}) {
  let renderArg
  const childSpy = jest.fn(controllerArg => {
    renderArg = controllerArg
    return children(controllerArg)
  })
  const wrapper = mount(<Downshift {...props}>{childSpy}</Downshift>)
  return {childSpy, wrapper, ...renderArg}
}
