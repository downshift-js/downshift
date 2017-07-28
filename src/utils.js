/**
 * This is a utilities file for the autocomplete component.
 * Part of the reason it exists is to be able to stub out
 * some things that don't work with jsdom.
 */

/**
 * This will take a node and select the given range of text from start to end in a
 * way that works for iOS
 * @param  {HTMLInputElement} node - the input to select the text in
 * @param  {Number} start - the index to start the selection
 * @param  {Number} end - the index to end the selection
 */
function selectRangeOfText(node, start, end) {
  // select all the text, but do it on the next tick because iOS has issues otherwise
  setTimeout(() => {
    // we're using setSelectionRange rather than select because select doesn't work with iOS
    node.setSelectionRange(start, end)
  })
}

/**
 * This will take a node and select all the text in it in a way that works for iOS
 * @param {HTMLInputElement} node - the input to select the text in
 */
function selectAllText(node) {
  selectRangeOfText(node, 0, node.value.length)
}

/**
 * Accepts a parameter and returns it if it's a function
 * or a noop function if it's not. This allows us to
 * accept a callback, but not worry about it if it's not
 * passed.
 * @param {Function} cb the callback
 * @return {Function} a function
 */
function cbToCb(cb) {
  return typeof cb === 'function' ? cb : noop
}
function noop() {}

/**
 * Get the closest parent element that scrolls
 * @param {HTMLElement} node - the child element to start searching for scroll parent at
 * @return {HTMLElement} the closest parentNode that scrolls
 */
function getScrollParent(node) {
  if (node === null) {
    return null
  } else if (node.scrollHeight > node.clientHeight) {
    return node
  } else {
    return getScrollParent(node.parentNode)
  }
}

/**
 * Scroll node into view
 * @param {HTMLInputElement} node - the element that should scroll into view
 */
function scrollIntoView(node) {
  const scrollParent = getScrollParent(node)
  if (scrollParent) {
    const nodeTop = node.offsetTop - scrollParent.offsetTop
    if (scrollParent.scrollTop >= nodeTop) {
      scrollParent.scrollTop = nodeTop
    } else if (
      nodeTop + node.offsetHeight >=
      scrollParent.scrollTop + scrollParent.offsetHeight
    ) {
      scrollParent.scrollTop =
        nodeTop + node.offsetHeight - scrollParent.offsetHeight
    }
  }
}

function debounce(fn, time) {
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

function compose(...fns) {
  return (...args) => fns.forEach(fn => fn && fn(...args))
}

export {
  cbToCb,
  compose,
  debounce,
  scrollIntoView,
  selectAllText,
  selectRangeOfText,
}
