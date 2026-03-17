import {type Action} from '../../utils'
import {
  UseTagGroupReducerAction,
  UseTagGroupState,
  UseTagGroupStateChangeTypes,
} from '../index.types'
import {useTagGroupReducer} from '../reducer'

test('reducer throws error if called without proper action type', () => {
  expect(() => {
    useTagGroupReducer({activeIndex: 0, items: []}, {
      type: 'super-bogus' as UseTagGroupStateChangeTypes,
    } as Action<UseTagGroupState<never>, UseTagGroupReducerAction<never>>)
  }).toThrow('Invalid useTagGroup reducer action.')
})
