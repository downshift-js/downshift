import {callOnChangeProps} from '../callOnChangeProps'

test('callOnChangeProps calls onStateChange with changed properties', () => {
  const onStateChange = jest.fn()
  const props = {stateReducer: () => ({}), onStateChange}
  const action = {type: 'test', props}
  const state = {count: 0}
  const newState = {count: 1}

  callOnChangeProps(action, props, state, newState)

  expect(onStateChange).toHaveBeenCalledTimes(1)
  expect(onStateChange).toHaveBeenCalledWith({type: 'test', count: 1})
})

test('callOnChangeProps does not call onStateChange if there are no changes', () => {
  const onStateChange = jest.fn()
  const props = {stateReducer: () => ({}), onStateChange}
  const action = {type: 'test', props}
  const state = {count: 0}
  const newState = {count: 0}

  callOnChangeProps(action, props, state, newState)

  expect(onStateChange).not.toHaveBeenCalled()
})

test('callOnChangeProps does not call onStateChange if onStateChange is not provided', () => {
  const props = {stateReducer: () => ({})}
  const action = {type: 'test', props}
  const state = {count: 0}
  const newState = {count: 1}

  callOnChangeProps(action, props, state, newState)

  expect(() => callOnChangeProps(action, props, state, newState)).not.toThrow()
})

test('callOnChangeProps does not call onStateChange if onStateChange is not a function', () => {
  const props = {
    stateReducer: () => ({}),
    onStateChange: 'not a function' as unknown as () => void,
  }
  const action = {type: 'test', props}
  const state = {count: 0}
  const newState = {count: 1}

  expect(() => callOnChangeProps(action, props, state, newState)).not.toThrow()
})

test('callOnChangeProps calls specific on[Key]Change handlers', () => {
  const onCountChange = jest.fn()
  const props = {stateReducer: () => ({}), onCountChange}
  const action = {type: 'test', props}
  const state = {count: 0}
  const newState = {count: 1}

  callOnChangeProps(action, props, state, newState)

  expect(onCountChange).toHaveBeenCalledTimes(1)
  expect(onCountChange).toHaveBeenCalledWith({type: 'test', count: 1})
})

test('callOnChangeProps does not call on[Key]Change handlers if the value did not change', () => {
  const onCountChange = jest.fn()
  const props = {stateReducer: () => ({}), onCountChange}
  const action = {type: 'test', props}
  const state = {count: 0}
  const newState = {count: 0}

  callOnChangeProps(action, props, state, newState)

  expect(onCountChange).not.toHaveBeenCalled()
})

test('callOnChangeProps does not call on[Key]Change handlers if the handler is not a function', () => {
  const props = {
    stateReducer: () => ({}),
    onCountChange: 'not a function' as unknown as () => void,
  }
  const action = {type: 'test', props}
  const state = {count: 0}
  const newState = {count: 1}

  expect(() => callOnChangeProps(action, props, state, newState)).not.toThrow()
})

test('callOnChangeProps does not call on[Key]Change handlers if the handler is not provided', () => {
  const props = {stateReducer: () => ({})}
  const action = {type: 'test', props}
  const state = {count: 0}
  const newState = {count: 1}

  expect(() => callOnChangeProps(action, props, state, newState)).not.toThrow()
})

test('callOnChangeProps calls multiple on[Key]Change handlers if multiple values changed', () => {
  const onCountChange = jest.fn()
  const onOtherChange = jest.fn()
  const onStateChange = jest.fn()
  const props = {stateReducer: () => ({}), onCountChange, onOtherChange, onStateChange}
  const action = {type: 'test', props}
  const state = {count: 0, other: 'a'}
  const newState = {count: 1, other: 'b'}

  callOnChangeProps(action, props, state, newState)

  expect(onCountChange).toHaveBeenCalledTimes(1)
  expect(onCountChange).toHaveBeenCalledWith({
    type: 'test',
    count: 1,
    other: 'b',
  })
  expect(onOtherChange).toHaveBeenCalledTimes(1)
  expect(onOtherChange).toHaveBeenCalledWith({
    type: 'test',
    count: 1,
    other: 'b',
  })
  expect(onStateChange).toHaveBeenCalledTimes(1)
  expect(onStateChange).toHaveBeenCalledWith({type: 'test', count: 1, other: 'b'})
})

test('callOnChangeProps calls onStateChange with all changes even if some on[Key]Change handlers are missing', () => {
  const onCountChange = jest.fn()
  const onStateChange = jest.fn()
  const props = {
    stateReducer: () => ({}),
    onCountChange,
    onOtherChange: undefined,
    onStateChange,
  }
  const action = {type: 'test', props}
  const state = {count: 0, other: 'a'}
  const newState = {count: 1, other: 'b'}

  callOnChangeProps(action, props, state, newState)

  expect(onCountChange).toHaveBeenCalledTimes(1)
  expect(onCountChange).toHaveBeenCalledWith({
    type: 'test',
    count: 1,
    other: 'b',
  })
  expect(onStateChange).toHaveBeenCalledTimes(1)
  expect(onStateChange).toHaveBeenCalledWith({
    type: 'test',
    count: 1,
    other: 'b',
  })
})