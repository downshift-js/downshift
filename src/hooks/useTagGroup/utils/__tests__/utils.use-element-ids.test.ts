import {renderHook} from '@testing-library/react'
import {useElementIds} from '..'

jest.mock('react', () => {
  const {useId, ...react} = jest.requireActual('react')
  return react
})

jest.mock('../../../../utils-ts', () => ({
  generateId: jest.fn().mockReturnValue('test-id'),
}))

describe('useElementIds', () => {
  test('uses React.useId for React < 18', () => {
    const {result} = renderHook(() => useElementIds({}))

    expect(result.current).toEqual({
      getTagId: expect.any(Function),
      tagGroupId: 'downshift-test-id-tag-group',
    })
    expect(result.current.getTagId(12)).toEqual('downshift-test-id-tag-12')
  })
})
