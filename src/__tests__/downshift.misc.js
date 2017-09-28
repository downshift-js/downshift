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
  const children = ({getInputProps}) => (
    <div>
      <input {...getInputProps()} />
    </div>
  )
  const {wrapper, openMenu, selectItem, clearSelection} = setup({children})
  openMenu()
  selectItem('foo')
  clearSelection()
  const input = wrapper.find('input').first()
  expect(document.activeElement).toBe(input.getDOMNode())
})

test('toggleMenu can take no arguments at all', () => {
  const {toggleMenu, childSpy} = setup()
  toggleMenu()
  expect(childSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      isOpen: true,
    }),
  )
})

test('clearItems clears the all items', () => {
  const items = ['Chess']
  const {wrapper, clearItems} = setup({items})
  clearItems()
  expect(wrapper.instance().items).toEqual([])
})

test('reset can take no arguments at all', () => {
  const {reset, childSpy} = setup()
  reset()
  expect(childSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      isOpen: false,
    }),
  )
})

test('setHighlightedIndex can take no arguments at all', () => {
  const defaultHighlightedIndex = 2
  const {setHighlightedIndex, childSpy} = setup({
    defaultHighlightedIndex,
  })
  setHighlightedIndex()
  expect(childSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      highlightedIndex: defaultHighlightedIndex,
    }),
  )
})

test('openAndHighlightDefaultIndex can take no arguments at all', () => {
  const defaultHighlightedIndex = 2
  const {wrapper, childSpy} = setup({
    defaultHighlightedIndex,
  })
  const {openAndHighlightDefaultIndex} = wrapper.instance()
  openAndHighlightDefaultIndex()
  expect(childSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      highlightedIndex: defaultHighlightedIndex,
    }),
  )
})

test('can specify a custom ID which is used in item IDs (good for SSR)', () => {
  const id = 'my-custom-id'
  const {getItemProps} = setup({id})
  expect(getItemProps({item: 'blah'}).id).toContain(id)
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
