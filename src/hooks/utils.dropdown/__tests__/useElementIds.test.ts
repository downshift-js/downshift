import {renderHook} from '@testing-library/react'

import {useElementIds} from '../useElementIds'

describe('useElementIds', () => {
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
})
