// this is stuff that I couldn't think fit anywhere else
// but we still want to have tested.

import React from 'react'
import {mount} from 'enzyme'
import Downshift from '../'

test('closeMenu closes the menu', () => {
  const {openMenu, closeMenu, childSpy} = setup()
  openMenu()
  closeMenu()
  expect(childSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({isOpen: false}),
  )
})

test('clearSelection clears an existing selection', () => {
  const {openMenu, selectItem, childSpy, clearSelection} = setup()
  openMenu()
  selectItem('foo')
  clearSelection()
  expect(childSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({selectedItem: null}),
  )
})

test('selectItemAtIndex does nothing if there is no item at that index', () => {
  const {openMenu, selectItemAtIndex, childSpy} = setup()
  openMenu()
  childSpy.mockClear()
  selectItemAtIndex(100)
  expect(childSpy).not.toHaveBeenCalled()
})

test('clearSelection with an input node focuses the input node', () => {
  const children = ({getInputProps}) =>
    (<div>
      <input {...getInputProps()} />
    </div>)
  const {wrapper, openMenu, selectItem, clearSelection} = setup({children})
  openMenu()
  selectItem('foo')
  clearSelection()
  const input = wrapper.find('input').first()
  expect(document.activeElement).toBe(input.getDOMNode())
})

test('onStateChange called with changes and all the state', () => {
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
    selectedItem: itemToSelect,
    inputValue: itemToSelect,
  }
  const allState = {
    ...controlledState,
    isOpen: false,
    highlightedIndex: null,
  }
  expect(handleStateChange).toHaveBeenLastCalledWith(changes, allState)
})

test('onChange called when clearSelection is trigered', () => {
  const handleChange = jest.fn()
  const { clearSelection } = setup({
    selectedItem: 'foo',
    onChange: handleChange
  })
  clearSelection()
  expect(handleChange).toHaveBeenCalled()
})

function setup({children = () => <div />, ...props} = {}) {
  let renderArg
  const childSpy = jest.fn(controllerArg => {
    renderArg = controllerArg
    return children(controllerArg)
  })
  const wrapper = mount(
    <Downshift {...props}>
      {childSpy}
    </Downshift>,
  )
  return {childSpy, wrapper, ...renderArg}
}
