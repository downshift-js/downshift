/* eslint-disable @typescript-eslint/no-explicit-any */
import {useTagGroupReducer} from '../reducer'

test('reducer throws error if called without proper action type', () => {
  expect(() => {
    useTagGroupReducer(
      {activeIndex: 0, items: []},
      {
        type: 'super-bogus' as any,
        props: {} as any,
      },
    )
  }).toThrow('Invalid useTagGroup reducer action.')
})
