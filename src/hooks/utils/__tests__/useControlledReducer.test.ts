import * as React from 'react'
import {renderHook} from '@testing-library/react'

import {useControlledReducer} from '../useControlledReducer'

test('useControlledReducer merges state changes with controlled values', () => {
  const reducer = (state: {count: number}, action: {type: string}) => {
    // eslint-disable-next-line jest/no-conditional-in-test
    switch (action.type) {
      case 'increment':
        return {count: state.count + 1}
      default:
        return state
    }
  }

  const initialState = () => ({count: 0})
  const controlledProps = {
    count: 5,
    stateReducer: (state: {count: number}) => state,
  }

  const {result} = renderHook(() =>
    useControlledReducer(
      reducer,
      controlledProps,
      initialState,
      (prev, next) => prev.count === next.count,
    ),
  )

  const [state, dispatch] = result.current

  expect(state.count).toBe(5)

  React.act(() => {
    dispatch({type: 'increment'})
  })

  expect(state.count).toBe(5)
})
