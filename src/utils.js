let idCounter = 1

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

function findParent(finder, node, rootNode) {
  if (node !== null && node !== rootNode.parentNode) {
    if (finder(node)) {
      return node
    } else {
      return findParent(finder, node.parentNode, rootNode)
    }
  } else {
    return null
  }
}

/**
* Get the closest element that scrolls
* @param {HTMLElement} node - the child element to start searching for scroll parent at
* @param {HTMLElement} rootNode - the root element of the component
* @return {HTMLElement} the closest parentNode that scrolls
*/
const getClosestScrollParent = findParent.bind(
  null,
  node => node.scrollHeight > node.clientHeight,
)

/**
 * Scroll node into view if necessary
 * @param {HTMLElement} node - the element that should scroll into view
 * @param {HTMLElement} rootNode - the root element of the component
 * @param {Boolean} alignToTop - align element to the top of the visible area of the scrollable ancestor
 */
function scrollIntoView(node, rootNode) {
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
  if (nodeTop < scrollParent.scrollTop) {
    // the item is above the scrollable area
    scrollParent.scrollTop = nodeTop
  } else if (
    nodeTop + nodeRect.height >
    scrollParent.scrollTop + scrollParentRect.height
  ) {
    // the item is below the scrollable area
    scrollParent.scrollTop = nodeTop + nodeRect.height - scrollParentRect.height
  }
  // the item is within the scrollable area (do nothing)
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

// eslint-disable-next-line complexity
function getA11yStatusMessage({
  isOpen,
  highlightedItem,
  selectedItem,
  resultCount,
  previousResultCount,
  itemToString,
}) {
  if (!isOpen) {
    if (selectedItem) {
      return itemToString(selectedItem)
    } else {
      return ''
    }
  }
  const resultCountChanged = resultCount !== previousResultCount
  if (!resultCount) {
    return 'No results.'
  } else if (!highlightedItem || resultCountChanged) {
    return `${resultCount} ${resultCount === 1 ?
      'result is' :
      'results are'} available, use up and down arrow keys to navigate.`
  }
  return itemToString(highlightedItem)
}

export {
  cbToCb,
  findParent,
  composeEventHandlers,
  debounce,
  scrollIntoView,
  generateId,
  firstDefined,
  isNumber,
  getA11yStatusMessage,
}
