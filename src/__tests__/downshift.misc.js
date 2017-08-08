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

function setup({children = () => <div />} = {}) {
  let renderArg
  const childSpy = jest.fn(controllerArg => {
    renderArg = controllerArg
    return children(controllerArg)
  })
  const wrapper = mount(
    <Downshift>
      {childSpy}
    </Downshift>,
  )
  return {childSpy, wrapper, ...renderArg}
}
