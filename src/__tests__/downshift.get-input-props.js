import React from 'react'
import {mount} from 'enzyme'
import Downshift from '../'

const colors = [
  'Red',
  'Green',
  'Blue',
  'Orange',
  'Purple',
  'Pink',
  'Palevioletred',
  'Rebeccapurple',
  'Navy Blue',
]

test('manages arrow up and down behavior', () => {
  const {Component, childSpy} = setup()
  const wrapper = mount(<Component />)
  const input = wrapper.find(sel('input'))
  // ↓
  input.simulate('keydown', {key: 'ArrowDown'})
  expect(childSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({isOpen: true, highlightedIndex: null}),
  )

  // ↓
  input.simulate('keydown', {key: 'ArrowDown'})
  expect(childSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({highlightedIndex: 0}),
  )

  // ↓
  input.simulate('keydown', {key: 'ArrowDown'})
  expect(childSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({highlightedIndex: 1}),
  )

  // <Shift>↓
  input.simulate('keydown', {key: 'ArrowDown', shiftKey: true})
  expect(childSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({highlightedIndex: 6}),
  )

  // ↑
  input.simulate('keydown', {key: 'ArrowUp'})
  expect(childSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({highlightedIndex: 5}),
  )

  // <Shift>↑
  input.simulate('keydown', {key: 'ArrowUp', shiftKey: true})
  expect(childSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({highlightedIndex: 0}),
  )

  // ↑
  input.simulate('keydown', {key: 'ArrowUp'})
  expect(childSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({highlightedIndex: colors.length - 1}),
  )

  // ↓
  input.simulate('keydown', {key: 'ArrowDown'})
  expect(childSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({highlightedIndex: 0}),
  )
})

test('arrow key down events do nothing when no items are rendered', () => {
  const {Component, childSpy} = setup({items: []})
  const wrapper = mount(<Component />)
  const input = wrapper.find(sel('input'))
  // ↓↓
  input.simulate('keydown', {key: 'ArrowDown'})
  input.simulate('keydown', {key: 'ArrowDown'})
  expect(childSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({highlightedIndex: null}),
  )
})

test('arrow up on a closed menu opens the menu', () => {
  const {Component, childSpy} = setup()
  const wrapper = mount(<Component />)
  const input = wrapper.find(sel('input'))
  // ↑
  input.simulate('keydown', {key: 'ArrowUp'})
  expect(childSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({isOpen: true, highlightedIndex: null}),
  )

  // ↑
  input.simulate('keydown', {key: 'ArrowUp'})
  expect(childSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({highlightedIndex: colors.length - 1}),
  )
})

test('enter on an input with a closed menu does nothing', () => {
  const {Component, childSpy} = setup()
  const wrapper = mount(<Component />)
  const input = wrapper.find(sel('input'))
  // ENTER
  childSpy.mockClear()
  input.simulate('keydown', {key: 'Enter'})
  // does not even rerender
  expect(childSpy).not.toHaveBeenCalled()
})

test('enter on an input with an open menu does nothing without a highlightedIndex', () => {
  const {Component, childSpy} = setup()
  const wrapper = mount(<Component isOpen={true} />)
  const input = wrapper.find(sel('input'))
  // ENTER
  childSpy.mockClear()
  input.simulate('keydown', {key: 'Enter'})
  // does not even rerender
  expect(childSpy).not.toHaveBeenCalled()
})

test('enter on an input with an open menu and a highlightedIndex selects that item', () => {
  const {Component, childSpy} = setup()
  const onChange = jest.fn()
  const isOpen = true
  const wrapper = mount(<Component isOpen={isOpen} onChange={onChange} />)
  const input = wrapper.find(sel('input'))
  // ↓
  input.simulate('keydown', {key: 'ArrowDown'})
  // ENTER
  input.simulate('keydown', {key: 'Enter'})
  expect(onChange).toHaveBeenCalledTimes(1)
  const newState = expect.objectContaining({
    selectedItem: colors[0],
    isOpen,
    highlightedIndex: null,
    inputValue: colors[0],
  })
  expect(onChange).toHaveBeenCalledWith(colors[0], newState)
  expect(childSpy).toHaveBeenLastCalledWith(newState)
})

test('escape on an input without a selection should reset downshift and close the menu', () => {
  const {Component, childSpy} = setup()
  const wrapper = mount(<Component />)
  const input = wrapper.find(sel('input'))
  input.simulate('change', {target: {value: 'p'}})
  input.simulate('keydown', {key: 'Escape'})
  expect(input.node.value).toBe('')
  expect(childSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({
      isOpen: false,
      inputValue: '',
    }),
  )
})

test('escape on an input with a selection should reset downshift and close the menu', () => {
  const {input, childSpy, items} = setupDownshiftWithState()
  input.simulate('keydown', {key: 'Escape'})
  expect(childSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({
      isOpen: false,
      inputValue: items[0],
      selectedItem: items[0],
    }),
  )
})

test('on input blur resets the state', () => {
  const {input, childSpy, items} = setupDownshiftWithState()
  input.simulate('blur')
  expect(childSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({
      isOpen: false,
      inputValue: items[0],
      selectedItem: items[0],
    }),
  )
})

test('on input blur does not reset the state when the mouse is down', () => {
  const {input, childSpy} = setupDownshiftWithState()
  // mousedown somwhere
  document.body.dispatchEvent(
    new window.MouseEvent('mousedown', {bubbles: true}),
  )
  input.simulate('blur')
  expect(childSpy).not.toHaveBeenCalled()
})

test('keydown of things that are not handled do nothing', () => {
  const modifiers = [undefined, 'Shift']
  const {Component, childSpy} = setup()
  const wrapper = mount(<Component />)
  const input = wrapper.find(sel('input'))
  childSpy.mockClear()
  modifiers.forEach(key => {
    input.simulate('keydown', {key})
  })
  // does not even rerender
  expect(childSpy).not.toHaveBeenCalled()
})

test('highlightedIndex uses the given itemCount prop to determine the last index', () => {
  const {Component, childSpy} = setup()
  const itemCount = 200
  const wrapper = mount(<Component itemCount={itemCount} isOpen={true} />)
  const input = wrapper.find(sel('input'))
  // ↑
  input.simulate('keydown', {key: 'ArrowUp'})
  expect(childSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({highlightedIndex: itemCount - 1}),
  )
})

test('Enter when there is no item at index 0 still selects the highlighted item', () => {
  // test inspired by https://github.com/paypal/downshift/issues/119
  // use case is virtualized lists
  const items = [
    {value: 'cat', index: 1},
    {value: 'dog', index: 2},
    {value: 'bird', index: 3},
    {value: 'cheetah', index: 4},
  ]
  const {Component, childSpy} = setup({items})
  const wrapper = mount(
    <Component
      itemToString={i => (i ? i.value : '')}
      defaultHighlightedIndex={1}
      isOpen={true}
    />,
  )
  const input = wrapper.find(sel('input'))
  // ↓
  input.simulate('keydown', {key: 'ArrowDown'})
  // ENTER
  childSpy.mockClear()
  input.simulate('keydown', {key: 'Enter'})
  expect(childSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({
      selectedItem: items[1],
    }),
  )
})

function setupDownshiftWithState() {
  const items = ['animal', 'bug', 'cat']
  const {Component, childSpy} = setup({items})
  const wrapper = mount(<Component />)
  const input = wrapper.find(sel('input'))
  input.simulate('keydown')
  input.simulate('change', {target: {value: 'a'}})
  // ↓
  input.simulate('keydown', {key: 'ArrowDown'})
  // ENTER to select the first one
  input.simulate('keydown', {key: 'Enter'})
  expect(input.node.value).toBe(items[0])
  // ↓
  input.simulate('keydown', {key: 'ArrowDown'})
  input.simulate('change', {target: {value: 'bu'}})
  childSpy.mockClear()
  return {childSpy, input, items, wrapper}
}

function setup({items = colors} = {}) {
  /* eslint-disable react/jsx-closing-bracket-location */
  const childSpy = jest.fn(({isOpen, getInputProps, getItemProps}) =>
    (<div>
      <input {...getInputProps({'data-test': 'input'})} />
      {isOpen &&
        <div>
          {items.map((item, index) =>
            (<div
              key={item.index || index}
              {...getItemProps({item, index: item.index || index})}
            >
              {item.value ? item.value : item}
            </div>),
          )}
        </div>}
    </div>),
  )

  function BasicDownshift(props) {
    return (
      <Downshift {...props}>
        {childSpy}
      </Downshift>
    )
  }
  return {
    Component: BasicDownshift,
    childSpy,
  }
}

function sel(id) {
  return `[data-test="${id}"]`
}
