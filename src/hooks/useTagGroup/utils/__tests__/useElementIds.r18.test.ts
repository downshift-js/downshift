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

describe('useElementIds for React >= 18', () => {
  test('uses React.useId', () => {
    const {result} = renderHook(() => useElementIds({}))

    expect(result.current).toEqual({
      getTagId: expect.any(Function),
      tagGroupId: 'downshift-mocked-id-tag-group',
    })
    expect(result.current.getTagId(10)).toEqual("downshift-mocked-id-tag-10")
  })

  test('returns the same reference on re-renders when the props do not change', () => {
      const getTestTagId = () => 'test-tag-id'
      const {result, rerender} = renderHook(useElementIds, {
        initialProps: {
          id: 'test-id',
          tagGroupId: 'test-tag-group-id',
          getTagId: getTestTagId,
        },
      })
      const renderOneResult = result.current
      rerender({
        id: 'test-id',
        tagGroupId: 'test-tag-group-id',
        getTagId: getTestTagId,
      })
      const renderTwoResult = result.current
      expect(renderOneResult).toBe(renderTwoResult)
    })
  
    test('returns a new reference on re-renders when the props change', () => {
      const {result, rerender} = renderHook(useElementIds, {
        initialProps: {
          id: 'test-id',
          tagGroupId: 'test-tag-group-id',
          getTagId: () => 'test-tag-id',
        },
      })
      const renderOneResult = result.current
      rerender({
        id: 'test-id',
        tagGroupId: 'test-tag-group-id',
        getTagId: () => 'test-tag-id',
      })
      const renderTwoResult = result.current
      expect(renderOneResult).not.toBe(renderTwoResult)
    })

  test('generates stable IDs across re-renders', () => {
    const {result, rerender} = renderHook(() => useElementIds({}))

    const firstTagGroupId = result.current.tagGroupId
    const firstTagId = result.current.getTagId(0)

    rerender()

    expect(result.current.tagGroupId).toBe(firstTagGroupId)
    expect(result.current.getTagId(0)).toBe(firstTagId)
  })

  test('uses provided id prop', () => {
    const {result} = renderHook(() => useElementIds({id: 'custom-id'}))

    expect(result.current.tagGroupId).toBe('custom-id-tag-group')
    expect(result.current.getTagId(5)).toBe('custom-id-tag-5')
  })

  test('uses custom tagGroupId and getTagId when provided', () => {
    const customGetTagId = (index: number) => `my-tag-${index}`
    const {result} = renderHook(() =>
      useElementIds({
        tagGroupId: 'my-tag-group',
        getTagId: customGetTagId,
      }),
    )

    expect(result.current.tagGroupId).toBe('my-tag-group')
    expect(result.current.getTagId(3)).toBe('my-tag-3')
  })
})
