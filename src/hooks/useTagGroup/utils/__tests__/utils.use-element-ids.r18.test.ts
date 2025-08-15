import {renderHook} from '@testing-library/react'
import {useElementIds} from '..'

jest.mock('react', () => {
  return {
    ...jest.requireActual('react'),
    useId() {
      return 'mocked-id'
    },
  }
})

describe('useElementIds', () => {
  test('uses React.useId for React >= 18', () => {
    const {result} = renderHook(() => useElementIds({}))

    expect(result.current).toEqual({
      getTagId: expect.any(Function),
      tagGroupId: 'downshift-mocked-id-tag-group',
    })
    expect(result.current.getTagId(10)).toEqual("downshift-mocked-id-tag-10")
  })
})
