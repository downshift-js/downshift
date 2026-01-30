import reducer from '../reducer'

describe('utils', () => {
  test('reducer throws error if called without proper action type', () => {
    expect(() => {
      reducer({}, {}, {type: 'super-bogus'})
    }).toThrowError('Reducer called without proper action type.')
  })
})
