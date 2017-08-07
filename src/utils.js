/**
 * This is a utilities file for the autocomplete component.
 * Part of the reason it exists is to be able to stub out
 * some things that don't work with jsdom.
 */

let idCounter = 1

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
 * Get the closest element that scrolls
 * @param {HTMLElement} node - the child element to start searching for scroll parent at
 * @param {HTMLElement} rootNode - the root element of the component
 * @return {HTMLElement} the closest parentNode that scrolls
 */
function getClosestScrollParent(node, rootNode) {
  if (node !== null && node !== rootNode) {
    if (node.scrollHeight > node.clientHeight) {
      return node
    } else {
      return getClosestScrollParent(node.parentNode)
    }
  } else {
    return null
  }
}

/**
 * Scroll node into view if necessary
 * @param {HTMLElement} node - the element that should scroll into view
 * @param {HTMLElement} rootNode - the root element of the component
 * @param {Boolean} alignToTop - align element to the top of the visible area of the scrollable ancestor
 */
function scrollIntoView(node, rootNode, alignToTop) {
  const scrollParent = getClosestScrollParent(node, rootNode)
  if (scrollParent === null) {
    return
  }
  const scrollParentStyles = getComputedStyle(scrollParent)
  const scrollParentRect = scrollParent.getBoundingClientRect()
  const scrollParentBorderTopWidth = parseInt(
    scrollParentStyles.borderTopWidth,
    10,
  )
  const scrollParentTop = scrollParentRect.top + scrollParentBorderTopWidth
  const nodeRect = node.getBoundingClientRect()
  const nodeOffsetTop = nodeRect.top + scrollParent.scrollTop
  const nodeTop = nodeOffsetTop - scrollParentTop
  if (alignToTop || nodeTop < scrollParent.scrollTop) {
    scrollParent.scrollTop = nodeTop
  } else if (
    nodeTop + nodeRect.height >
    scrollParent.scrollTop + scrollParentRect.height
  ) {
    scrollParent.scrollTop = nodeTop + nodeRect.height - scrollParentRect.height
  }
}

/**
 * Simple debounce implementation. Will call the given
 * function once after the time given has passed since
 * it was last called.
 * @param {Function} fn the function to call after the time
 * @param {Number} time the time to wait
 * @return {Function} the debounced function
 */
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

/**
 * returns a function that calls the given functions in
 * sequence with the arguments that are passed to the
 * function returned.
 * @param {Function} fns the functions to call
 * @return {Function} the function that calls the functions
 */
function compose(...fns) {
  return (...args) => fns.forEach(fn => fn && fn(...args))
}

/**
 * This is intended to be used to compose event handlers
 * They are executed in order until one of them calls
 * `event.preventDefault()`. Not sure this is the best
 * way to do this, but it seems legit...
 * @param {Function} fns the event hanlder functions
 * @return {Function} the event handler to add to an element
 */
function composeEventHandlers(...fns) {
  return (event, ...args) =>
    fns.some(fn => {
      fn && fn(event, ...args)
      return event.defaultPrevented
    })
}

/**
 * This generates a unique ID for all autocomplete inputs
 * @param {String} prefix the prefix for the id
 * @return {String} the unique ID
 */
function generateId(prefix) {
  return `${prefix}-${idCounter++}`
}

/**
 * Returns the first argument that is not undefined
 * @param {...*} args the arguments
 * @return {*} the defined value
 */
function firstDefined(...args) {
  return args.find(a => typeof a !== 'undefined')
}

function isNumber(thing) {
  // not NaN and is a number type
  // eslint-disable-next-line no-self-compare
  return thing === thing && typeof thing === 'number'
}

export {
  cbToCb,
  compose,
  composeEventHandlers,
  debounce,
  scrollIntoView,
  selectAllText,
  selectRangeOfText,
  generateId,
  firstDefined,
  isNumber,
}
