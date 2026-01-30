import {renderHook} from '@testing-library/react'
import {useElementIds} from '../utils'

jest.mock('react', () => {
  const {useId, ...react} = jest.requireActual('react')
  return react
})

jest.mock('../../utils-ts/generateId.ts', () => ({
  generateId: jest.fn().mockReturnValue('test-id'),
}))

describe('useElementIds', () => {
  test('uses React.useId for React < 18', () => {
    const {result} = renderHook(() => useElementIds({}))

    expect(result.current).toEqual({
      getItemId: expect.any(Function),
      inputId: 'downshift-test-id-input',
      labelId: 'downshift-test-id-label',
      menuId: 'downshift-test-id-menu',
      toggleButtonId: 'downshift-test-id-toggle-button',
    })
    expect(result.current.getItemId(5)).toEqual("downshift-test-id-item-5")
  })
})
