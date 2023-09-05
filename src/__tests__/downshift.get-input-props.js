import * as React from 'react'
import {render, fireEvent, screen, createEvent, act} from '@testing-library/react'
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
  const {arrowUpInput, arrowDownInput, childrenSpy, endOnInput, homeOnInput} =
    renderDownshift()
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

describe('arrow down opens menu and highlights item at index', () => {
  test('0 by default', () => {
    const {arrowDownInput, childrenSpy} = renderDownshift()
    // ↓
    arrowDownInput()
    expect(childrenSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({isOpen: true, highlightedIndex: 0}),
    )
  })

  test('initialHighlightedIndex + 1', () => {
    const initialHighlightedIndex = 3
    const {arrowDownInput, childrenSpy} = renderDownshift({
      // provide only highlightedIndex
      props: {initialHighlightedIndex},
    })
    // ↓
    arrowDownInput()
    expect(childrenSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({
        isOpen: true,
        highlightedIndex: initialHighlightedIndex + 1,
      }),
    )
  })

  test('defaultHighlightedIndex + 1', () => {
    const defaultHighlightedIndex = 2
    const {arrowDownInput, childrenSpy} = renderDownshift({
      // provide only defaultHighlightedIndex
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

  test('initialHighlightedIndex + 1 then defaultHighlightedIndex + 1', () => {
    const initialHighlightedIndex = 3
    const defaultHighlightedIndex = 2
    const {arrowDownInput, escapeOnInput, childrenSpy} = renderDownshift({
      // provide both initialHighlightedIndex and defaultHighlightedIndex
      props: {defaultHighlightedIndex, initialHighlightedIndex},
    })
    // ↓
    arrowDownInput()
    expect(childrenSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({
        isOpen: true,
        highlightedIndex: initialHighlightedIndex + 1,
      }),
    )
    escapeOnInput()
    // ↓
    arrowDownInput()
    expect(childrenSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({
        isOpen: true,
        highlightedIndex: defaultHighlightedIndex + 1,
      }),
    )
  })

  test('0 if defaultHighlightedIndex is length - 1', () => {
    const defaultHighlightedIndex = colors.length - 1
    const {arrowDownInput, childrenSpy} = renderDownshift({
      // provide defaultHighlightedIndex as last in the list.
      props: {defaultHighlightedIndex},
    })
    // ↓
    arrowDownInput()
    expect(childrenSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({
        isOpen: true,
        highlightedIndex: 0,
      }),
    )
  })

  test('0 if defaultHighlightedIndex is out of bounds', () => {
    const {arrowDownInput, childrenSpy} = renderDownshift({
      // provide defaultHighlightedIndex as invalid
      props: {defaultHighlightedIndex: colors.length + 5},
    })
    // ↓
    arrowDownInput()
    expect(childrenSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({
        isOpen: true,
        highlightedIndex: 0,
      }),
    )
  })

  test('highlightedIndex if controlled', () => {
    const highlightedIndex = 2
    const {arrowDownInput, childrenSpy} = renderDownshift({
      // control highlightedIndex
      props: {highlightedIndex},
    })
    // ↓
    arrowDownInput()
    expect(childrenSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({
        isOpen: true,
        highlightedIndex,
      }),
    )
  })
})

describe('arrow up opens menu and highlights item at index', () => {
  test('length - 1 by default', () => {
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

  test('initialHighlightedIndex - 1', () => {
    const initialHighlightedIndex = 3
    const {arrowUpInput, childrenSpy} = renderDownshift({
      // provide only initialHighlightedIndex
      props: {initialHighlightedIndex},
    })
    // ↑
    arrowUpInput()
    expect(childrenSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({
        isOpen: true,
        highlightedIndex: initialHighlightedIndex - 1,
      }),
    )
  })

  test('defaultHighlightedIndex - 1', () => {
    const defaultHighlightedIndex = 2
    const {arrowUpInput, childrenSpy} = renderDownshift({
      // provide only defaultHighlightedIndex
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

  test('initialHighlightedIndex - 1 then defaultHighlightedIndex - 1', () => {
    const initialHighlightedIndex = 3
    const defaultHighlightedIndex = 2
    const {arrowUpInput, escapeOnInput, childrenSpy} = renderDownshift({
      // provide both initialHighlightedIndex and defaultHighlightedIndex
      props: {defaultHighlightedIndex, initialHighlightedIndex},
    })
    // ↑
    arrowUpInput()
    expect(childrenSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({
        isOpen: true,
        highlightedIndex: initialHighlightedIndex - 1,
      }),
    )
    escapeOnInput()
    // ↑
    arrowUpInput()
    expect(childrenSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({
        isOpen: true,
        highlightedIndex: defaultHighlightedIndex - 1,
      }),
    )
  })

  test('length - 1 if defaultHighlightedIndex is 0', () => {
    const defaultHighlightedIndex = 0
    const {arrowUpInput, childrenSpy} = renderDownshift({
      // provide defaultHighlightedIndex as first in the list
      props: {defaultHighlightedIndex},
    })
    // ↑
    arrowUpInput()
    expect(childrenSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({
        isOpen: true,
        highlightedIndex: colors.length - 1,
      }),
    )
  })

  test('length - 1 if defaultHighlightedIndex is out of bounds', () => {
    const {arrowUpInput, childrenSpy} = renderDownshift({
      // provide defaultHighlightedIndex as invalid
      props: {defaultHighlightedIndex: colors.length + 5},
    })
    // ↑
    arrowUpInput()
    expect(childrenSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({
        isOpen: true,
        highlightedIndex: colors.length - 1,
      }),
    )
  })

  test('highlightedIndex if controlled', () => {
    const highlightedIndex = 2
    const {arrowUpInput, childrenSpy} = renderDownshift({
      // control highlightedIndex
      props: {highlightedIndex},
    })
    // ↑
    arrowUpInput()
    expect(childrenSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({
        isOpen: true,
        highlightedIndex,
      }),
    )
  })
})

test('navigation key down events do nothing when no items are rendered', () => {
  const {
    arrowDownInput,
    arrowUpInput,
    endOnInput,
    homeOnInput,
    escapeOnInput,
    childrenSpy,
  } = renderDownshift({items: []})
  const keysOnInput = [arrowDownInput, arrowUpInput, endOnInput, homeOnInput]
  // ↓ ↑ end home
  keysOnInput.forEach(keyOnInput => {
    keyOnInput()
    expect(childrenSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({highlightedIndex: null}),
    )
    escapeOnInput() // close dropdown after each opening.
  })
  // ↓ ↑ end home
  keysOnInput.forEach(keyOnInput => {
    keyOnInput()
    expect(childrenSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({highlightedIndex: null}),
    )
    // do not close dropdown, but still there should be no update.
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

test('home and end keys should not prevent event default when menu is closed', () => {
  const {input} = renderDownshift()
  const homeKeyDownEvent = createEvent.keyDown(input, {key: 'Home'})
  const endKeyDownEvent = createEvent.keyDown(input, {key: 'End'})
  // home
  fireEvent(input, homeKeyDownEvent)
  expect(homeKeyDownEvent.defaultPrevented).toBe(false)

  // end
  fireEvent(input, endKeyDownEvent)
  expect(endKeyDownEvent.defaultPrevented).toBe(false)
})

test('home and end keys should prevent event default when menu is open', () => {
  const {input} = renderDownshift({props: {defaultIsOpen: true}})
  const homeKeyDownEvent = createEvent.keyDown(input, {key: 'Home'})
  const endKeyDownEvent = createEvent.keyDown(input, {key: 'End'})
  // home
  fireEvent(input, homeKeyDownEvent)
  expect(homeKeyDownEvent.defaultPrevented).toBe(true)

  // end
  fireEvent(input, endKeyDownEvent)
  expect(endKeyDownEvent.defaultPrevented).toBe(true)
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

test('enter on an input with an open menu and a highlightedIndex but with IME composing will not select that item', () => {
  const {enterOnInput, childrenSpy} = renderDownshift({
    props: {initialIsOpen: true, initialHighlightedIndex: 0},
  })
  const extraEventProps = {keyCode: 229}
  childrenSpy.mockClear()

  // Enter but for IME
  enterOnInput(extraEventProps)

  // does not even rerender
  expect(childrenSpy).not.toHaveBeenCalled()

  // Enter without IME
  enterOnInput()

  // now it behaves normally
  expect(childrenSpy).toHaveBeenCalledTimes(1)
  expect(childrenSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      selectedItem: colors[0],
      inputValue: colors[0],
      isOpen: false,
      highlightedIndex: null,
    }),
  )
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
  const {changeInputValue, input, escapeOnInput, childrenSpy} =
    renderDownshift()
  changeInputValue('p')
  escapeOnInput()
  expect(input).toHaveValue('')
  expect(childrenSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({
      isOpen: false,
      selectedItem: null,
      inputValue: '',
    }),
  )
})

test('escape on an input with a selection and open should only reset downshift', () => {
  const {escapeOnInput, childrenSpy} = renderDownshift()
  escapeOnInput()
  expect(childrenSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({isOpen: false}),
  )
})

test('escape on an input with a selection and closed menu should reset downshift, clear input and close the menu', () => {
  const {escapeOnInput, childrenSpy} = setupDownshiftWithState()
  escapeOnInput()
  escapeOnInput()
  expect(childrenSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({
      isOpen: false,
      inputValue: '',
      selectedItem: null,
    }),
  )
})

test('on input blur resets the state', () => {
  const {blurOnInput, childrenSpy, items} = setupDownshiftWithState()
  blurOnInput()
  act(() => {
    jest.runAllTimers()
  })
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
  render(
    <Downshift isOpen={true} itemCount={10}>
      {childrenSpy}
    </Downshift>,
  )
  const input = screen.queryByTestId('input')
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
      itemToString: i => i.value,
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
  // eslint-disable-next-line jest/no-conditional-in-test
  if (entry) {
    throw new Error(
      `getInputProps should not have any props that are callbacks. It has ${entry[0]}.`,
    )
  }
})

test('highlightedIndex is reset to defaultHighlightedIndex when inputValue changes', () => {
  const defaultHighlightedIndex = 0
  const {childrenSpy, arrowDownInput, changeInputValue} = renderDownshift({
    props: {defaultHighlightedIndex},
  })

  childrenSpy.mockClear()
  arrowDownInput() // highlightedIndex = 1
  changeInputValue('r')
  expect(childrenSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({
      highlightedIndex: defaultHighlightedIndex,
    }),
  )
})

test('highlight should be removed on inputValue change if defaultHighlightedIndex is not provided', () => {
  const {childrenSpy, arrowDownInput, changeInputValue} = renderDownshift()

  childrenSpy.mockClear()
  arrowDownInput() // highlightedIndex = 1
  changeInputValue('r')

  expect(childrenSpy).toHaveBeenLastCalledWith(
    expect.objectContaining({
      highlightedIndex: null,
    }),
  )
})

function setupDownshiftWithState() {
  const items = ['animal', 'bug', 'cat']
  const utils = renderDownshift({items})
  const {input, changeInputValue, arrowDownInput, enterOnInput, childrenSpy} =
    utils
  // input.fireEvent('keydown')
  changeInputValue('a')
  // ↓
  arrowDownInput()
  // ENTER to select the first one
  enterOnInput()
  expect(input).toHaveValue(items[0])
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
        {isOpen ? (
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
        ) : null}
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
  const input = screen.queryByTestId('input')
  return {
    Component,
    childrenSpy,
    ...utils,
    input,
    button: screen.queryByTestId('button'),
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
