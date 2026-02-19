import {noop} from './noop'

/**
 * Accepts a parameter and returns it if it's a function
 * or a noop function if it's not. This allows us to
 * accept a callback, but not worry about it if it's not
 * passed.
 *
 * @param cb the callback
 * @return a function
 */
export function cbToCb(cb: Function): Function {
  return typeof cb === 'function' ? cb : noop
}
