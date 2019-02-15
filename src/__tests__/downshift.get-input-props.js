import 'react-testing-library/cleanup-after-each'
import React from 'react'
import {render, fireEvent} from 'react-testing-library'
import Downshift from '../'

jest.useFakeTimers()

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
  const {
    arrowUpInput,
    arrowDownInput,
    childrenSpy,
    endOnInput,
    homeOnInput,
  } = renderDownshift()
  // ↓
  arrowDownInput()
  expect(childrenSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({isOpen: true, highlightedIndex: 0}),
  )

  // ↓
  arrowDownInput()
  expect(childrenSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({highlightedIndex: 1}),
  )

  // ↓
  arrowDownInput()
  expect(childrenSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({highlightedIndex: 2}),
  )

  // <Shift>↓
  arrowDownInput({shiftKey: true})
  expect(childrenSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({highlightedIndex: 7}),
  )

  // ↑
  arrowUpInput()
  expect(childrenSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({highlightedIndex: 6}),
  )

  // ↑
  arrowUpInput()
  expect(childrenSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({highlightedIndex: 5}),
  )

  // <Shift>↑
  arrowUpInput({shiftKey: true})
  expect(childrenSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({highlightedIndex: 0}),
  )

  // ↑
  arrowUpInput()
  expect(childrenSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({highlightedIndex: colors.length - 1}),
  )

  // ↓
  arrowDownInput()
  expect(childrenSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({highlightedIndex: 0}),
  )

  endOnInput()
  expect(childrenSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({highlightedIndex: colors.length - 1}),
  )

  homeOnInput()
  expect(childrenSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({highlightedIndex: 0}),
  )
})

test('arrow down opens menu and highlights first item by default', () => {
  const {arrowDownInput, childrenSpy} = renderDownshift()
  // ↓
  arrowDownInput()
  expect(childrenSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({isOpen: true, highlightedIndex: 0}),
  )
})

test('arrow up opens menu and highlights last item by default', () => {
  const {arrowUpInput, childrenSpy} = renderDownshift()
  // ↑
  arrowUpInput()
  expect(childrenSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({
      isOpen: true,
      highlightedIndex: colors.length - 1,
    }),
  )
})

test('arrow down opens menu and highlights defaultHighlightedIndex + 1 if provided', () => {
  const defaultHighlightedIndex = 2
  const {arrowDownInput, childrenSpy} = renderDownshift({
    props: {defaultHighlightedIndex},
  })
  // ↓
  arrowDownInput()
  expect(childrenSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({
      isOpen: true,
      highlightedIndex: defaultHighlightedIndex + 1,
    }),
  )
})

test('arrow up opens menu and highlights defaultHighlightedIndex - 1 if provided', () => {
  const defaultHighlightedIndex = 2
  const {arrowUpInput, childrenSpy} = renderDownshift({
    props: {defaultHighlightedIndex},
  })
  // ↑
  arrowUpInput()
  expect(childrenSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({
      isOpen: true,
      highlightedIndex: defaultHighlightedIndex - 1,
    }),
  )
})

test('navigation key down events do nothing when no items are rendered', () => {
  const {
    arrowDownInput,
    arrowUpInput,
    endOnInput,
    homeOnInput,
    childrenSpy,
  } = renderDownshift({items: []})
  const keysOnInput = [arrowDownInput, arrowUpInput, endOnInput, homeOnInput]
  // ↓ ↑ end home
  keysOnInput.forEach(keyOnInput => {
    keyOnInput()
    expect(childrenSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({highlightedIndex: null}),
    )
  })
})

test('home and end keys should not call highlighting method when menu is closed', () => {
  const {childrenSpy, endOnInput, homeOnInput} = renderDownshift()
  // home
  homeOnInput()
  expect(childrenSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({isOpen: false, highlightedIndex: null}),
  )

  // end
  endOnInput()
  expect(childrenSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({isOpen: false, highlightedIndex: null}),
  )
})

test('enter on an input with a closed menu does nothing', () => {
  const {enterOnInput, childrenSpy} = renderDownshift()
  childrenSpy.mockClear()
  // ENTER
  enterOnInput()
  // does not even rerender
  expect(childrenSpy).not.toHaveBeenCalled()
})

test('enter on an input with an open menu does nothing without a highlightedIndex', () => {
  const {enterOnInput, childrenSpy} = renderDownshift({props: {isOpen: true}})
  childrenSpy.mockClear()
  // ENTER
  enterOnInput()
  // does not even rerender
  expect(childrenSpy).not.toHaveBeenCalled()
})

test('enter on an input with an open menu and a highlightedIndex selects that item', () => {
  const onChange = jest.fn()
  const isOpen = true
  const {arrowDownInput, enterOnInput, childrenSpy} = renderDownshift({
    props: {isOpen, onChange},
  })
  // ↓
  arrowDownInput()
  // ENTER
  enterOnInput()
  expect(onChange).toHaveBeenCalledTimes(1)
  const newState = expect.objectContaining({
    selectedItem: colors[0],
    isOpen,
    highlightedIndex: null,
    inputValue: colors[0],
  })
  expect(onChange).toHaveBeenCalledWith(colors[0], newState)
  expect(childrenSpy).toHaveBeenLastCalledWith(newState)
})

test('escape on an input without a selection should reset downshift and close the menu', () => {
  const {
    changeInputValue,
    input,
    escapeOnInput,
    childrenSpy,
  } = renderDownshift()
  changeInputValue('p')
  escapeOnInput()
  expect(input.value).toBe('')
  expect(childrenSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({
      isOpen: false,
      inputValue: '',
    }),
  )
})

test('escape on an input with a selection should reset downshift and close the menu', () => {
  const {escapeOnInput, childrenSpy, items} = setupDownshiftWithState()
  escapeOnInput()
  expect(childrenSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({
      isOpen: false,
      inputValue: items[0],
      selectedItem: items[0],
    }),
  )
})

test('on input blur resets the state', () => {
  const {blurOnInput, childrenSpy, items} = setupDownshiftWithState()
  blurOnInput()
  jest.runAllTimers()
  expect(childrenSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({
      isOpen: false,
      inputValue: items[0],
      selectedItem: items[0],
    }),
  )
})

test('on input blur does not reset the state when the mouse is down', () => {
  const {blurOnInput, childrenSpy} = setupDownshiftWithState()
  // mousedown somwhere
  fireEvent.mouseDown(document.body)
  blurOnInput()
  jest.runAllTimers()
  expect(childrenSpy).not.toHaveBeenCalled()
})

test('on input blur does not reset the state when new focus is on downshift button', () => {
  const {blurOnInput, childrenSpy, button} = setupDownshiftWithState()
  blurOnInput()
  button.focus()
  jest.runAllTimers()
  expect(childrenSpy).not.toHaveBeenCalled()
})

test('keydown of things that are not handled do nothing', () => {
  const modifiers = [undefined, 'Shift']
  const {input, childrenSpy} = renderDownshift()
  childrenSpy.mockClear()
  modifiers.forEach(key => {
    fireEvent.keyDown(input, {key})
  })
  // does not even rerender
  expect(childrenSpy).not.toHaveBeenCalled()
})

test('highlightedIndex uses the given itemCount prop to determine the last index', () => {
  const itemCount = 200
  const {arrowUpInput, childrenSpy} = renderDownshift({
    props: {itemCount, isOpen: true},
  })
  // ↑
  arrowUpInput()
  expect(childrenSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({highlightedIndex: itemCount - 1}),
  )
})

test('itemCount can be set and unset asynchronously', () => {
  let downshift
  const childrenSpy = jest.fn(d => {
    downshift = d
    return (
      <div>
        <input {...d.getInputProps({'data-testid': 'input'})} />
      </div>
    )
  })
  const {queryByTestId} = render(
    <Downshift isOpen={true} itemCount={10}>
      {childrenSpy}
    </Downshift>,
  )
  const input = queryByTestId('input')
  const up = () => fireEvent.keyDown(input, {key: 'ArrowUp'})
  const down = () => fireEvent.keyDown(input, {key: 'ArrowDown'})

  downshift.setItemCount(100)
  up()
  expect(childrenSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({highlightedIndex: 99}),
  )
  down()
  expect(childrenSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({highlightedIndex: 0}),
  )
  downshift.setItemCount(40)
  up()
  expect(childrenSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({highlightedIndex: 39}),
  )
  down()
  expect(childrenSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({highlightedIndex: 0}),
  )
  downshift.unsetItemCount()
  up()
  expect(childrenSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({highlightedIndex: 9}),
  )
})

test('Enter when there is no item at index 0 still selects the highlighted item', () => {
  // test inspired by https://github.com/downshift-js/downshift/issues/119
  // use case is virtualized lists
  const items = [
    {value: 'cat', index: 1},
    {value: 'dog', index: 2},
    {value: 'bird', index: 3},
    {value: 'cheetah', index: 4},
  ]
  const {arrowDownInput, enterOnInput, childrenSpy} = renderDownshift({
    items,
    props: {
      itemToString: i => (i ? i.value : ''),
      defaultHighlightedIndex: 1,
      isOpen: true,
    },
  })

  // ↓
  arrowDownInput()
  // ENTER
  childrenSpy.mockClear()
  enterOnInput()
  expect(childrenSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({
      selectedItem: items[1],
    }),
  )
})

test('Cancel default event handler while composing', () => {
  const utils = renderDownshift({
    props: {highlightedIndex: 0, isOpen: true},
  })
  const {arrowDownInput, changeInputValue, enterOnInput, childrenSpy} = utils
  const extraEventProps = {which: 229, isComposing: true}

  changeInputValue('konnichiwa', extraEventProps)
  // ↓ but for IME
  arrowDownInput(extraEventProps)
  // Enter but for IME
  enterOnInput(extraEventProps)
  expect(childrenSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({
      isOpen: true,
      highlightedIndex: 0,
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
  const utils = renderDownshift({items})
  const {
    input,
    changeInputValue,
    arrowDownInput,
    enterOnInput,
    childrenSpy,
  } = utils
  // input.fireEvent('keydown')
  changeInputValue('a')
  // ↓
  arrowDownInput()
  // ENTER to select the first one
  enterOnInput()
  expect(input.value).toBe(items[0])
  // ↓
  arrowDownInput()
  changeInputValue('bu')
  childrenSpy.mockClear()
  return {childrenSpy, items, ...utils}
}

function setup({items = colors} = {}) {
  /* eslint-disable react/jsx-closing-bracket-location */
  const childrenSpy = jest.fn(
    ({isOpen, getInputProps, getToggleButtonProps, getItemProps}) => (
      <div>
        <input {...getInputProps({'data-testid': 'input'})} />
        <button {...getToggleButtonProps({'data-testid': 'button'})} />
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
    ),
  )

  function BasicDownshift(props) {
    return <Downshift {...props}>{childrenSpy}</Downshift>
  }
  return {
    Component: BasicDownshift,
    childrenSpy,
  }
}

function renderDownshift({items, props} = {}) {
  const {Component, childrenSpy} = setup({items})
  const utils = render(<Component {...props} />)
  const input = utils.queryByTestId('input')
  return {
    Component,
    childrenSpy,
    ...utils,
    input,
    button: utils.queryByTestId('button'),
    arrowDownInput: extraEventProps =>
      fireEvent.keyDown(input, {key: 'ArrowDown', ...extraEventProps}),
    arrowUpInput: extraEventProps =>
      fireEvent.keyDown(input, {key: 'ArrowUp', ...extraEventProps}),
    endOnInput: extraEventProps =>
      fireEvent.keyDown(input, {key: 'End', ...extraEventProps}),
    escapeOnInput: extraEventProps =>
      fireEvent.keyDown(input, {key: 'Escape', ...extraEventProps}),
    enterOnInput: extraEventProps =>
      fireEvent.keyDown(input, {key: 'Enter', ...extraEventProps}),
    homeOnInput: extraEventProps =>
      fireEvent.keyDown(input, {key: 'Home', ...extraEventProps}),
    changeInputValue: (value, extraEventProps) =>
      fireEvent.change(input, {target: {value}, ...extraEventProps}),
    blurOnInput: extraEventProps => fireEvent.blur(input, extraEventProps),
  }
}

function setupWithDownshiftController() {
  let renderArg
  render(
    <Downshift>
      {controllerArg => {
        renderArg = controllerArg
        return null
      }}
    </Downshift>,
  )
  return renderArg
}
