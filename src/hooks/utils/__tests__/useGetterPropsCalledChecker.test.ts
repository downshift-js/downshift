import {renderHook} from '@testing-library/react'

import {useGetterPropsCalledChecker} from '../useGetterPropsCalledChecker'

describe('useGetterPropsCalledChecker', () => {
  beforeAll(() => jest.spyOn(console, 'error').mockImplementation(() => {}))
  afterEach(() => {
    jest.clearAllMocks()
  })
  afterAll(() => jest.mocked(console.error).mockRestore())

  test('does not show an error if the checking function is called', () => {
    renderHook(() => {
      const check = useGetterPropsCalledChecker('getToggleButtonProps')
      check('getToggleButtonProps', false, 'ref', {
        current: document.createElement('div'),
      })

      return check
    })

    expect(console.error).not.toHaveBeenCalled()
  })

  test('shows an error if the checking function is not called', () => {
    renderHook(() => useGetterPropsCalledChecker('getToggleButtonProps'))

    expect(console.error).toHaveBeenCalledTimes(1)
    expect(console.error).toHaveBeenCalledWith(
      'downshift: You forgot to call the getToggleButtonProps getter function on your component / element.',
    )
  })

  test('shows an error if the ref is not applied correctly', () => {
    renderHook(() => {
      const check = useGetterPropsCalledChecker('getToggleButtonProps')
      check('getToggleButtonProps', false, 'ref', {current: null})

      return check
    })

    expect(console.error).toHaveBeenCalledTimes(1)
    expect(console.error).toHaveBeenCalledWith(
      'downshift: The ref prop "ref" from getToggleButtonProps was not applied correctly on your element.',
    )
  })

  test('does not show an error if the ref error is suppressed', () => {
    renderHook(() => {
      const check = useGetterPropsCalledChecker('getToggleButtonProps')
      check('getToggleButtonProps', true, 'ref', {current: null})

      return check
    })

    expect(console.error).not.toHaveBeenCalled()
  })

  test('handles multiple getter props', () => {
    renderHook(() => {
      const check = useGetterPropsCalledChecker(
        'getToggleButtonProps',
        'getMenuProps',
      )
      check('getToggleButtonProps', false, 'ref', {
        current: document.createElement('div'),
      })

      return check
    })

    expect(console.error).toHaveBeenCalledTimes(1)
    expect(console.error).toHaveBeenCalledWith(
      'downshift: You forgot to call the getMenuProps getter function on your component / element.',
    )
  })
})
