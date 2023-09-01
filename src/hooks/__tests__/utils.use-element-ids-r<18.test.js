const {renderHook} = require('@testing-library/react-hooks')
const {useElementIds} = require('../utils')

jest.mock('react', () => {
  const {useId, ...react} = jest.requireActual('react')
  return react
})

jest.mock('../../utils', () => {
  const downshiftUtils = jest.requireActual('../../utils')

  return {
    ...downshiftUtils,
    generateId: () => 'test-id',
  }
})

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
  })
})
