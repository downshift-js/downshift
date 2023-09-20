// this is stuff that I couldn't think fit anywhere else
// but we still want to have tested.

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {act, render} from '@testing-library/react'
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
  const children = ({getItemProps}) => (
    <div>
      {items.map((item, index) => (
        <div key={index} {...getItemProps({item})}>
          {item}
        </div>
      ))}
    </div>
  )
  const {selectItemAtIndex, childrenSpy} = setup({children})
  act(() => {
    selectItemAtIndex(1)
  })
  expect(childrenSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({selectedItem: ''}),
  )
})

test('toggleMenu can take no arguments at all', () => {
  const {toggleMenu, childrenSpy} = setup()
  act(() => {
    toggleMenu()
  })
  expect(childrenSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      isOpen: true,
    }),
  )
})

test('clearItems clears the all items', () => {
  const item = 'Chess'
  const children = ({getItemProps}) => (
    <div>
      <div key={item} {...getItemProps({item})}>
        {item}
      </div>
    </div>
  )
  // IMPLEMENTATION DETAIL TEST :-(
  // eslint-disable-next-line react/no-render-return-value
  const downshiftInstance = ReactDOM.render(
    <Downshift>{children}</Downshift>,
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
  const children = () => <div />
  render(
    <React.StrictMode>
      <Downshift>{children}</Downshift>
    </React.StrictMode>,
  )

  expect(console.error.mock.calls).toHaveLength(0)
})

test('can use setState for ultimate power', () => {
  const {childrenSpy, setState} = setup()
  childrenSpy.mockClear()
  act(() => {
    setState({isOpen: true, selectedItem: 'hi'})
  })
  expect(childrenSpy).toHaveBeenCalledTimes(1)
  expect(childrenSpy).toHaveBeenCalledWith(
    expect.objectContaining({isOpen: true, selectedItem: 'hi'}),
  )
})

test('warns when controlled component becomes uncontrolled', () => {
  const children = () => <div />
  const {rerender} = render(<Downshift selectedItem="hi">{children}</Downshift>)
  rerender(<Downshift selectedItem={undefined}>{children}</Downshift>)
  expect(console.error.mock.calls).toHaveLength(1)
  expect(console.error.mock.calls).toMatchSnapshot()
})

test('warns when uncontrolled component becomes controlled', () => {
  const children = () => <div />
  const {rerender} = render(<Downshift>{children}</Downshift>)
  rerender(<Downshift selectedItem="hi">{children}</Downshift>)
  expect(console.error.mock.calls).toHaveLength(1)
  expect(console.error.mock.calls).toMatchSnapshot()
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

test('initializes with the initial* props', () => {
  const initialState = {
    initialIsOpen: true,
    initialHighlightedIndex: 2,
    initialInputValue: 'hey',
    initialSelectedItem: 'sup',
  }
  const {childrenSpy} = setup(initialState)
  expect(childrenSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      isOpen: initialState.initialIsOpen,
      highlightedIndex: initialState.initialHighlightedIndex,
      inputValue: initialState.initialInputValue,
      selectedItem: initialState.initialSelectedItem,
    }),
  )
})

function setup({children = () => <div />, ...props} = {}) {
  let renderArg
  const childrenSpy = jest.fn(controllerArg => {
    renderArg = controllerArg
    return children(controllerArg)
  })
  const renderUtils = render(<Downshift {...props}>{childrenSpy}</Downshift>)
  return {childrenSpy, ...renderUtils, ...renderArg}
}
