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

function setup({children = () => <div />, ...props} = {}) {
  let renderArg
  const childSpy = jest.fn(controllerArg => {
    renderArg = controllerArg
    return children(controllerArg)
  })
  const wrapper = mount(<Downshift {...props}>{childSpy}</Downshift>)
  return {childSpy, wrapper, ...renderArg}
}
