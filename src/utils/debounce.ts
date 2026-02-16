/**
 * Simple debounce implementation. Will call the given
 * function once after the time given has passed since
 * it was last called.
 */
export function debounce(
  fn: Function,
  time: number,
): Function & {cancel: Function} {
  let timeoutId: NodeJS.Timeout | undefined | null

  function cancel() {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
  }

  function wrapper(...args: unknown[]) {
    cancel()
    timeoutId = setTimeout(() => {
      timeoutId = null
      fn(...args)
    }, time)
  }

  wrapper.cancel = cancel

  return wrapper
}
