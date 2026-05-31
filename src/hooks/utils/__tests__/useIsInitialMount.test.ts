import {renderHook} from '@testing-library/react'
import {useIsInitialMount} from '../useIsInitialMount'

test('useIsInitialMount returns true on first render and false on subsequent renders', () => {
  const {result, rerender} = renderHook(() => useIsInitialMount())

  expect(result.current).toBe(true)

  rerender()

  expect(result.current).toBe(false)
})

test('useIsInitialMount resets to true when component unmounts and remounts', () => {
  const {result, rerender, unmount} = renderHook(() => useIsInitialMount())

  expect(result.current).toBe(true)

  rerender()

  expect(result.current).toBe(false)

  unmount()

  const {result: remountedResult} = renderHook(() => useIsInitialMount())

  expect(remountedResult.current).toBe(true)
})

test('useIsInitialMount does not change value on re-renders', () => {
  const {result, rerender} = renderHook(() => useIsInitialMount())

  expect(result.current).toBe(true)

  rerender()
  rerender()
  rerender()

  expect(result.current).toBe(false)
})
