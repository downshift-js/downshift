/**
 * This is a utilities file for the autocomplete component.
 * Part of the reason it exists is to be able to stub out
 * some things that don't work with jsdom.
 */

/**
 * This moves the cursor position to the end of the text in the input node in a way
 * that works on iOS
 * @param {HTMLInputElement} node - the input to set the cursor position in
 */
function moveCursorToTheEnd(node) {
  const {length} = node.value
  node.setSelectionRange(length, length)
}

const compose = (...fns) => (...args) => fns.forEach(fn => fn && fn(...args))
const debounce = (fn, time) => {
  let timeoutId
  return wrapper
  function wrapper(...args) {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      timeoutId = null
      fn(...args)
    }, time)
  }
}

export {moveCursorToTheEnd, compose, debounce}
