import {renderHook} from '@testing-library/react'

import {useLatestRef} from '../useLatestRef'

test('useLatestRef', () => {
  const {result, rerender} = renderHook(val => useLatestRef(val), {
    initialProps: 'initial',
  })

  expect(result.current.current).toBe('initial')

  rerender('updated')
  expect(result.current.current).toBe('updated')
})
