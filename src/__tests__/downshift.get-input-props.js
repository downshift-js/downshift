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
  const {Component, renderSpy} = setup()
  const wrapper = mount(<Component />)
  const input = wrapper.find(sel('input'))
  // ↓
  input.simulate('keydown', {key: 'ArrowDown'})
  expect(renderSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({isOpen: true, highlightedIndex: null}),
  )

  // ↓
  input.simulate('keydown', {key: 'ArrowDown'})
  expect(renderSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({highlightedIndex: 0}),
  )

  // ↓
  input.simulate('keydown', {key: 'ArrowDown'})
  expect(renderSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({highlightedIndex: 1}),
  )

  // <Shift>↓
  input.simulate('keydown', {key: 'ArrowDown', shiftKey: true})
  expect(renderSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({highlightedIndex: 6}),
  )

  // ↑
  input.simulate('keydown', {key: 'ArrowUp'})
  expect(renderSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({highlightedIndex: 5}),
  )

  // <Shift>↑
  input.simulate('keydown', {key: 'ArrowUp', shiftKey: true})
  expect(renderSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({highlightedIndex: 0}),
  )

  // ↑
  input.simulate('keydown', {key: 'ArrowUp'})
  expect(renderSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({highlightedIndex: colors.length - 1}),
  )

  // ↓
  input.simulate('keydown', {key: 'ArrowDown'})
  expect(renderSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({highlightedIndex: 0}),
  )
})

test('arrow key down events do nothing when no items are rendered', () => {
  const {Component, renderSpy} = setup({items: []})
  const wrapper = mount(<Component />)
  const input = wrapper.find(sel('input'))
  // ↓↓
  input.simulate('keydown', {key: 'ArrowDown'})
  input.simulate('keydown', {key: 'ArrowDown'})
  expect(renderSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({highlightedIndex: null}),
  )
})

test('arrow up on a closed menu opens the menu', () => {
  const {Component, renderSpy} = setup()
  const wrapper = mount(<Component />)
  const input = wrapper.find(sel('input'))
  // ↑
  input.simulate('keydown', {key: 'ArrowUp'})
  expect(renderSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({isOpen: true, highlightedIndex: null}),
  )

  // ↑
  input.simulate('keydown', {key: 'ArrowUp'})
  expect(renderSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({highlightedIndex: colors.length - 1}),
  )
})

test('enter on an input with a closed menu does nothing', () => {
  const {Component, renderSpy} = setup()
  const wrapper = mount(<Component />)
  const input = wrapper.find(sel('input'))
  // ENTER
  renderSpy.mockClear()
  input.simulate('keydown', {key: 'Enter'})
  // does not even rerender
  expect(renderSpy).not.toHaveBeenCalled()
})

test('enter on an input with an open menu does nothing without a highlightedIndex', () => {
  const {Component, renderSpy} = setup()
  const wrapper = mount(<Component isOpen={true} />)
  const input = wrapper.find(sel('input'))
  // ENTER
  renderSpy.mockClear()
  input.simulate('keydown', {key: 'Enter'})
  // does not even rerender
  expect(renderSpy).not.toHaveBeenCalled()
})

test('enter on an input with an open menu and a highlightedIndex selects that item', () => {
  const {Component, renderSpy} = setup()
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
  expect(renderSpy).toHaveBeenLastCalledWith(newState)
})

test('escape on an input without a selection should reset downshift and close the menu', () => {
  const {Component, renderSpy} = setup()
  const wrapper = mount(<Component />)
  const input = wrapper.find(sel('input'))
  input.simulate('change', {target: {value: 'p'}})
  input.simulate('keydown', {key: 'Escape'})
  expect(input.instance().value).toBe('')
  expect(renderSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({
      isOpen: false,
      inputValue: '',
    }),
  )
})

test('escape on an input with a selection should reset downshift and close the menu', () => {
  const {input, renderSpy, items} = setupDownshiftWithState()
  input.simulate('keydown', {key: 'Escape'})
  expect(renderSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({
      isOpen: false,
      inputValue: items[0],
      selectedItem: items[0],
    }),
  )
})

test('on input blur resets the state', () => {
  const {input, renderSpy, items} = setupDownshiftWithState()
  input.simulate('blur')
  expect(renderSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({
      isOpen: false,
      inputValue: items[0],
      selectedItem: items[0],
    }),
  )
})

test('on input blur does not reset the state when the mouse is down', () => {
  const {input, renderSpy} = setupDownshiftWithState()
  // mousedown somwhere
  document.body.dispatchEvent(
    new window.MouseEvent('mousedown', {bubbles: true}),
  )
  input.simulate('blur')
  expect(renderSpy).not.toHaveBeenCalled()
})

test('on mouseup while input is focused the state should not be reset', () => {
  const {input} = setupDownshiftWithState()
  input.simulate('change', {target: {value: 'a'}})
  input.simulate('focus')
  expect(input.instance().value).toBe('a')
  document.body.dispatchEvent(new window.MouseEvent('mouseup', {bubbles: true}))
  expect(input.instance().value).toBe('a')
  input.simulate('blur')
  expect(input.instance().value).toBe('animal')
})

test('keydown of things that are not handled do nothing', () => {
  const modifiers = [undefined, 'Shift']
  const {Component, renderSpy} = setup()
  const wrapper = mount(<Component />)
  const input = wrapper.find(sel('input'))
  renderSpy.mockClear()
  modifiers.forEach(key => {
    input.simulate('keydown', {key})
  })
  // does not even rerender
  expect(renderSpy).not.toHaveBeenCalled()
})

test('highlightedIndex uses the given itemCount prop to determine the last index', () => {
  const {Component, renderSpy} = setup()
  const itemCount = 200
  const wrapper = mount(<Component itemCount={itemCount} isOpen={true} />)
  const input = wrapper.find(sel('input'))
  // ↑
  input.simulate('keydown', {key: 'ArrowUp'})
  expect(renderSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({highlightedIndex: itemCount - 1}),
  )
})

test('itemCount can be set and unset asynchronously', () => {
  let downshift
  const renderSpy = jest.fn(d => {
    downshift = d
    return (
      <div>
        <input {...d.getInputProps({'data-test': 'input'})} />
      </div>
    )
  })
  const wrapper = mount(
    <Downshift isOpen={true} render={renderSpy} itemCount={10} />,
  )
  const input = wrapper.find(sel('input'))
  const up = () => input.simulate('keydown', {key: 'ArrowUp'})
  const down = () => input.simulate('keydown', {key: 'ArrowDown'})

  downshift.setItemCount(100)
  up()
  expect(renderSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({highlightedIndex: 99}),
  )
  down()
  expect(renderSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({highlightedIndex: 0}),
  )
  downshift.setItemCount(40)
  up()
  expect(renderSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({highlightedIndex: 39}),
  )
  down()
  expect(renderSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({highlightedIndex: 0}),
  )
  downshift.unsetItemCount()
  up()
  expect(renderSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({highlightedIndex: 9}),
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
  const {Component, renderSpy} = setup({items})
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
  renderSpy.mockClear()
  input.simulate('keydown', {key: 'Enter'})
  expect(renderSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({
      selectedItem: items[1],
    }),
  )
})

// normally this test would be like the others where we render and then simulate a click on the
// button to ensure that a disabled input cannot be interacted with, however this is only a problem in IE11
// so we have to get into the implementation details a little bit (unless we want to run these tests
// in IE11... no thank you 🙅)
test(`getInputProps doesn't include event handlers when disabled is passed (for IE11 support)`, () => {
  const {getInputProps} = setupWithDownshiftController()
  const props = getInputProps({disabled: true})
  const entry = Object.entries(props).find(
    ([_key, value]) => typeof value === 'function',
  )
  if (entry) {
    throw new Error(
      `getInputProps should not have any props that are callbacks. It has ${
        entry[0]
      }.`,
    )
  }
})

function setupDownshiftWithState() {
  const items = ['animal', 'bug', 'cat']
  const {Component, renderSpy} = setup({items})
  const wrapper = mount(<Component />)
  const input = wrapper.find(sel('input'))
  input.simulate('keydown')
  input.simulate('change', {target: {value: 'a'}})
  // ↓
  input.simulate('keydown', {key: 'ArrowDown'})
  // ENTER to select the first one
  input.simulate('keydown', {key: 'Enter'})
  expect(input.instance().value).toBe(items[0])
  // ↓
  input.simulate('keydown', {key: 'ArrowDown'})
  input.simulate('change', {target: {value: 'bu'}})
  renderSpy.mockClear()
  return {renderSpy, input, items, wrapper}
}

function setup({items = colors} = {}) {
  /* eslint-disable react/jsx-closing-bracket-location */
  const renderSpy = jest.fn(({isOpen, getInputProps, getItemProps}) => (
    <div>
      <input {...getInputProps({'data-test': 'input'})} />
      {isOpen && (
        <div>
          {items.map((item, index) => (
            <div
              key={item.index || index}
              {...getItemProps({item, index: item.index || index})}
            >
              {item.value ? item.value : item}
            </div>
          ))}
        </div>
      )}
    </div>
  ))

  function BasicDownshift(props) {
    return <Downshift {...props} render={renderSpy} />
  }
  return {
    Component: BasicDownshift,
    renderSpy,
  }
}

function setupWithDownshiftController() {
  let renderArg
  mount(
    <Downshift
      render={controllerArg => {
        renderArg = controllerArg
        return null
      }}
    />,
  )
  return renderArg
}

function sel(id) {
  return `[data-test="${id}"]`
}
