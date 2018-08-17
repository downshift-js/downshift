// this is stuff that I couldn't think fit anywhere else
// but we still want to have tested.

import 'react-testing-library/cleanup-after-each'
import React from 'react'
import ReactDOM from 'react-dom'
import {render} from 'react-testing-library'
import Downshift from '../'

beforeEach(() => jest.spyOn(console, 'error').mockImplementation(() => {}))
afterEach(() => console.error.mockRestore())

test('closeMenu closes the menu', () => {
  const {openMenu, closeMenu, childrenSpy} = setup()
  openMenu()
  closeMenu()
  expect(childrenSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({isOpen: false}),
  )
})

test('clearSelection clears an existing selection', () => {
  const {openMenu, selectItem, childrenSpy, clearSelection} = setup()
  openMenu()
  selectItem('foo')
  clearSelection()
  expect(childrenSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({selectedItem: null}),
  )
})

test('selectItemAtIndex does nothing if there is no item at that index', () => {
  const {openMenu, selectItemAtIndex, childrenSpy} = setup()
  openMenu()
  childrenSpy.mockClear()
  selectItemAtIndex(100)
  expect(childrenSpy).not.toHaveBeenCalled()
})

test('selectItemAtIndex can select item that is an empty string', () => {
  const items = ['Chess', '']
  const renderFn = ({getItemProps}) => (
    <div>
      {items.map((item, index) => (
        <div key={index} {...getItemProps({item})}>
          {item}
        </div>
      ))}
    </div>
  )
  const {selectItemAtIndex, childrenSpy} = setup({render: renderFn})
  selectItemAtIndex(1)
  expect(childrenSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({selectedItem: ''}),
  )
})

test('toggleMenu can take no arguments at all', () => {
  const {toggleMenu, childrenSpy} = setup()
  toggleMenu()
  expect(childrenSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      isOpen: true,
    }),
  )
})

test('clearItems clears the all items', () => {
  const item = 'Chess'
  const renderFn = ({getItemProps}) => (
    <div>
      <div key={item} {...getItemProps({item})}>
        {item}
      </div>
    </div>
  )
  // IMPLEMENTATION DETAIL TEST :-(
  // eslint-disable-next-line react/no-render-return-value
  const downshiftInstance = ReactDOM.render(
    <Downshift>{renderFn}</Downshift>,
    document.createElement('div'),
  )
  expect(downshiftInstance.items).toEqual([item])
  downshiftInstance.clearItems()
  expect(downshiftInstance.items).toEqual([])
})

test('reset can take no arguments at all', () => {
  const {reset, childrenSpy} = setup()
  reset()
  expect(childrenSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      isOpen: false,
    }),
  )
})

test('setHighlightedIndex can take no arguments at all', () => {
  const defaultHighlightedIndex = 2
  const {setHighlightedIndex, childrenSpy} = setup({
    defaultHighlightedIndex,
  })
  setHighlightedIndex()
  expect(childrenSpy).toHaveBeenCalledWith(
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
  render(<Downshift>{childrenSpy}</Downshift>)
  expect(childrenSpy).toHaveBeenCalledTimes(1)
})

test('should not log error during strict mode during reset', () => {
  const renderFn = () => <div />
  render(
    <React.StrictMode>
      <Downshift>{renderFn}</Downshift>
    </React.StrictMode>,
  )

  expect(console.error.mock.calls).toHaveLength(0)
})

test('can use setState for ultimate power', () => {
  const {childrenSpy, setState} = setup()
  childrenSpy.mockClear()
  setState({isOpen: true, selectedItem: 'hi'})
  expect(childrenSpy).toHaveBeenCalledTimes(1)
  expect(childrenSpy).toHaveBeenCalledWith(
    expect.objectContaining({isOpen: true, selectedItem: 'hi'}),
  )
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

function setup({render: renderFn = () => <div />, ...props} = {}) {
  let renderArg
  const childrenSpy = jest.fn(controllerArg => {
    renderArg = controllerArg
    return renderFn(controllerArg)
  })
  const renderUtils = render(<Downshift {...props}>{childrenSpy}</Downshift>)
  return {childrenSpy, ...renderUtils, ...renderArg}
}
