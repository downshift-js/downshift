import {renderHook} from '@testing-library/react'

import {useElementIds} from '../useElementIds'

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
      getItemId: expect.any(Function),
      inputId: 'downshift-mocked-id-input',
      labelId: 'downshift-mocked-id-label',
      menuId: 'downshift-mocked-id-menu',
      toggleButtonId: 'downshift-mocked-id-toggle-button',
    })
    expect(result.current.getItemId(5)).toEqual('downshift-mocked-id-item-5')
  })
})
