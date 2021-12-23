import reducer from '../reducer'

describe('utils', () => {
  test('reducer throws error if called without proper action type', () => {
    expect(() => {
      // eslint-disable-next-line
      reducer({} as any, {type: 'super-bogus'} as any)
    }).toThrowError('Reducer called without proper action type.')
  })
})
