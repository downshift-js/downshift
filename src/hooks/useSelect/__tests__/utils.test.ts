import reducer from '../reducer'

test('reducer throws error if called without proper action type', () => {
  expect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
    reducer({} as any, {type: 'super-bogus'} as any)
  }).toThrow('Reducer called without proper action type.')
})
