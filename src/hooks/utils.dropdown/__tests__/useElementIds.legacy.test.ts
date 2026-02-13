import {renderHook} from '@testing-library/react'

import {useElementIds} from '../useElementIds'

jest.mock('react', () => {
  const {useId, ...react} = jest.requireActual('react')
  return react
})

describe('useElementIds', () => {
  test('uses generateId() for React < 18', () => {
    const {result} = renderHook(() => useElementIds({}))

    expect(result.current).toEqual({
      getItemId: expect.any(Function),
      inputId: 'downshift-0-input',
      labelId: 'downshift-0-label',
      menuId: 'downshift-0-menu',
      toggleButtonId: 'downshift-0-toggle-button',
    })
    expect(result.current.getItemId(5)).toEqual('downshift-0-item-5')
  })

  test('returns the same reference on re-renders when the props do not change', () => {
    const getTestItemId = () => 'test-item-id'
    const {result, rerender} = renderHook(useElementIds, {
      initialProps: {
        id: 'test-id',
        labelId: 'test-label-id',
        menuId: 'test-menu-id',
        getItemId: getTestItemId,
        toggleButtonId: 'test-toggle-button-id',
        inputId: 'test-input-id',
      },
    })
    const renderOneResult = result.current
    rerender({
      id: 'test-id',
      labelId: 'test-label-id',
      menuId: 'test-menu-id',
      getItemId: getTestItemId,
      toggleButtonId: 'test-toggle-button-id',
      inputId: 'test-input-id',
    })
    const renderTwoResult = result.current
    expect(renderOneResult).toBe(renderTwoResult)
  })

  test('returns a new reference on re-renders when the props change', () => {
    const {result, rerender} = renderHook(useElementIds, {
      initialProps: {
        id: 'test-id',
        labelId: 'test-label-id',
        menuId: 'test-menu-id',
        getItemId: () => 'test-item-id',
        toggleButtonId: 'test-toggle-button-id',
        inputId: 'test-input-id',
      },
    })
    const renderOneResult = result.current
    rerender({
      id: 'test-id',
      labelId: 'test-label-id',
      menuId: 'test-menu-id',
      getItemId: () => 'test-item-id',
      toggleButtonId: 'test-toggle-button-id',
      inputId: 'test-input-id',
    })
    const renderTwoResult = result.current
    expect(renderOneResult).not.toBe(renderTwoResult)
  })

  test('generates stable IDs across re-renders', () => {
    const {result, rerender} = renderHook(() => useElementIds({}))

    const firstInputId = result.current.inputId
    const firstLabelId = result.current.labelId
    const firstMenuId = result.current.menuId
    const firstToggleButtonId = result.current.toggleButtonId
    const firstGetItemId = result.current.getItemId(0)

    rerender()

    expect(result.current.inputId).toBe(firstInputId)
    expect(result.current.labelId).toBe(firstLabelId)
    expect(result.current.menuId).toBe(firstMenuId)
    expect(result.current.toggleButtonId).toBe(firstToggleButtonId)
    expect(result.current.getItemId(0)).toBe(firstGetItemId)
  })

  test('uses provided id prop', () => {
    const {result} = renderHook(() => useElementIds({id: 'custom-id'}))

    expect(result.current.inputId).toBe('custom-id-input')
    expect(result.current.labelId).toBe('custom-id-label')
    expect(result.current.menuId).toBe('custom-id-menu')
    expect(result.current.toggleButtonId).toBe('custom-id-toggle-button')
    expect(result.current.getItemId(7)).toBe('custom-id-item-7')
  })

  test('uses custom IDs when provided', () => {
    const customGetItemId = (index: number) => `my-item-${index}`
    const {result} = renderHook(() =>
      useElementIds({
        labelId: 'my-label',
        menuId: 'my-menu',
        getItemId: customGetItemId,
        toggleButtonId: 'my-toggle-button',
        inputId: 'my-input',
      }),
    )

    expect(result.current.labelId).toBe('my-label')
    expect(result.current.menuId).toBe('my-menu')
    expect(result.current.toggleButtonId).toBe('my-toggle-button')
    expect(result.current.inputId).toBe('my-input')
    expect(result.current.getItemId(3)).toBe('my-item-3')
  })
})
