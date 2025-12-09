import {UseTagGroupReducerAction} from '../index.types'
import {useTagGroupReducer} from '../reducer'

test('reducer throws error if called without proper action type', () => {
  expect(() => {
    useTagGroupReducer(
      {activeIndex: 0, items: []},
      {
        stateReducer(state) {
          return state
        },
        removeElementDescription: 'bla bla',
      },
      {type: 'super-bogus'} as unknown as UseTagGroupReducerAction<unknown>,
    )
  }).toThrow('Invalid useTagGroup reducer action.')
})
