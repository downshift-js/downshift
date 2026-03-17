/**
 * This is intended to be used to compose event handlers.
 * They are executed in order until one of them sets
 * `event.preventDownshiftDefault = true`.
 * @param fns the event handler functions
 * @return the event handler to add to an element
 */
export function callAllEventHandlers(...fns: (Function | undefined)[]) {
  return (
    event: React.SyntheticEvent & {
      preventDownshiftDefault?: boolean
      nativeEvent: {preventDownshiftDefault?: boolean}
    },
    ...args: unknown[]
  ) =>
    fns.some(fn => {
      if (fn) {
        fn(event, ...args)
      }
      return (
        event.preventDownshiftDefault ||
        (event.hasOwnProperty('nativeEvent') &&
          event.nativeEvent.preventDownshiftDefault)
      )
    })
}
