// this is stuff that I couldn't think fit anywhere else
// but we still want to have tested.

import React from 'react'
import {mount, render as enzymeRender} from 'enzyme'
import Downshift from '../'

test('closeMenu closes the menu', () => {
  const {openMenu, closeMenu, renderSpy} = setup()
  openMenu()
  closeMenu()
  expect(renderSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({isOpen: false}),
  )
})

test('clearSelection clears an existing selection', () => {
  const {openMenu, selectItem, renderSpy, clearSelection} = setup()
  openMenu()
  selectItem('foo')
  clearSelection()
  expect(renderSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({selectedItem: null}),
  )
})

test('selectItemAtIndex does nothing if there is no item at that index', () => {
  const {openMenu, selectItemAtIndex, renderSpy} = setup()
  openMenu()
  renderSpy.mockClear()
  selectItemAtIndex(100)
  expect(renderSpy).not.toHaveBeenCalled()
})

test('selectItemAtIndex can select item that is an empty string', () => {
  const items = ['Chess', '']
  const render = ({getItemProps}) => (
    <div>
      {items.map((item, index) => (
        <div key={index} {...getItemProps({item})}>
          {item}
        </div>
      ))}
    </div>
  )
  const {selectItemAtIndex, renderSpy} = setup({render})
  selectItemAtIndex(1)
  expect(renderSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({selectedItem: ''}),
  )
})

test('clearSelection with an input node focuses the input node', () => {
  const render = ({getInputProps}) => (
    <div>
      <input autoFocus {...getInputProps()} />
    </div>
  )
  const {wrapper, openMenu, selectItem, clearSelection} = setup({render})
  openMenu()
  selectItem('foo')
  clearSelection()
  const input = wrapper.find('input').first()
  expect(document.activeElement).toBe(input.getDOMNode())
})

test('toggleMenu can take no arguments at all', () => {
  const {toggleMenu, renderSpy} = setup()
  toggleMenu()
  expect(renderSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      isOpen: true,
    }),
  )
})

test('clearItems clears the all items', () => {
  const item = 'Chess'
  const render = ({getItemProps}) => (
    <div>
      <div key={item} {...getItemProps({item})}>
        {item}
      </div>
    </div>
  )
  const {wrapper, clearItems} = setup({render})
  clearItems()
  expect(wrapper.instance().items).toEqual([])
})

test('reset can take no arguments at all', () => {
  const {reset, renderSpy} = setup()
  reset()
  expect(renderSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      isOpen: false,
    }),
  )
})

test('setHighlightedIndex can take no arguments at all', () => {
  const defaultHighlightedIndex = 2
  const {setHighlightedIndex, renderSpy} = setup({
    defaultHighlightedIndex,
  })
  setHighlightedIndex()
  expect(renderSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      highlightedIndex: defaultHighlightedIndex,
    }),
  )
})

test('openAndHighlightDefaultIndex can take no arguments at all', () => {
  const defaultHighlightedIndex = 2
  const {wrapper, renderSpy} = setup({
    defaultHighlightedIndex,
  })
  const {openAndHighlightDefaultIndex} = wrapper.instance()
  openAndHighlightDefaultIndex()
  expect(renderSpy).toHaveBeenCalledWith(
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

test('can use children instead of render prop', () => {
  const childrenSpy = jest.fn()
  enzymeRender(<Downshift>{childrenSpy}</Downshift>)
  expect(childrenSpy).toHaveBeenCalledTimes(1)
})

describe('expect console.warn to fire—depending on process.env.NODE_ENV value', () => {
  const originalEnv = process.env.NODE_ENV

  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    process.env.NODE_ENV = originalEnv
    console.warn.mockRestore()
  })

  test(`it shouldn't log anything when value === 'production'`, () => {
    process.env.NODE_ENV = 'production'
    setup({selectedItem: {label: 'test', value: 'any'}})

    expect(console.warn).toHaveBeenCalledTimes(0)
  })

  test('it should warn exactly one time when value !== production', () => {
    process.env.NODE_ENV = 'development'
    setup({selectedItem: {label: 'test', value: 'any'}})

    expect(console.warn).toHaveBeenCalledTimes(1)
    expect(console.warn.mock.calls[0]).toMatchSnapshot()
  })
})

function setup({render = () => <div />, ...props} = {}) {
  let renderArg
  const renderSpy = jest.fn(controllerArg => {
    renderArg = controllerArg
    return render(controllerArg)
  })
  const wrapper = mount(<Downshift {...props} render={renderSpy} />)
  return {renderSpy, wrapper, ...renderArg}
}

/* eslint no-console:0 */
