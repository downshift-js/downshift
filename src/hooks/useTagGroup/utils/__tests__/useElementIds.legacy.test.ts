import {renderHook} from '@testing-library/react'
import {useElementIds} from '..'

jest.mock('react', () => {
  const {useId, ...react} = jest.requireActual('react')
  return react
})

describe('useElementIds for React < 18', () => {
  test('uses generateId()', () => {
    const {result} = renderHook(() => useElementIds({}))

    expect(result.current).toEqual({
      getTagId: expect.any(Function),
      tagGroupId: 'downshift-0-tag-group',
    })
    expect(result.current.getTagId(12)).toEqual('downshift-0-tag-12')
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
    expect(result.current.getTagId(7)).toBe('custom-id-tag-7')
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
    expect(result.current.getTagId(4)).toBe('my-tag-4')
  })
})
