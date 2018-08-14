import computeScrollIntoView from 'compute-scroll-into-view'
import {isPreact} from './is.macro'

let idCounter = 0

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
 * Scroll node into view if necessary
 * @param {HTMLElement} node the element that should scroll into view
 * @param {HTMLElement} rootNode the root element of the component
 */
function scrollIntoView(node, rootNode) {
  if (node === null) {
    return
  }

  const actions = computeScrollIntoView(node, {
    boundary: rootNode,
    block: 'nearest',
    scrollMode: 'if-needed',
  })
  actions.forEach(({el, top, left}) => {
    el.scrollTop = top
    el.scrollLeft = left
  })
}

/**
 * @param {HTMLElement} parent the parent node
 * @param {HTMLElement} child the child node
 * @return {Boolean} whether the parent is the child or the child is in the parent
 */
function isOrContainsNode(parent, child) {
  return parent === child || (parent.contains && parent.contains(child))
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

  function cancel() {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
  }

  function wrapper(...args) {
    cancel()
    timeoutId = setTimeout(() => {
      timeoutId = null
      fn(...args)
    }, time)
  }

  wrapper.cancel = cancel

  return wrapper
}

/**
 * This is intended to be used to compose event handlers.
 * They are executed in order until one of them sets
 * `event.preventDownshiftDefault = true`.
 * @param {...Function} fns the event handler functions
 * @return {Function} the event handler to add to an element
 */
function callAllEventHandlers(...fns) {
  return (event, ...args) =>
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

/**
 * This return a function that will call all the given functions with
 * the arguments with which it's called. It does a null-check before
 * attempting to call the functions and can take any number of functions.
 * @param {...Function} fns the functions to call
 * @return {Function} the function that calls all the functions
 */
function callAll(...fns) {
  return (...args) => {
    fns.forEach(fn => {
      if (fn) {
        fn(...args)
      }
    })
  }
}

/**
 * This generates a unique ID for an instance of Downshift
 * @return {String} the unique ID
 */
function generateId() {
  return String(idCounter++)
}

/**
 * This is only used in tests
 * @param {Number} num the number to set the idCounter to
 */
function setIdCounter(num) {
  idCounter = num
}

/**
 * Resets idCounter to 0. Used for SSR.
 */
function resetIdCounter() {
  idCounter = 0
}

/**
 * @param {Object} param the downshift state and other relevant properties
 * @return {String} the a11y status message
 */
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
    return `${resultCount} ${
      resultCount === 1 ? 'result is' : 'results are'
    } available, use up and down arrow keys to navigate.`
  }
  return itemToString(highlightedItem)
}

/**
 * Takes an argument and if it's an array, returns the first item in the array
 * otherwise returns the argument
 * @param {*} arg the maybe-array
 * @param {*} defaultValue the value if arg is falsey not defined
 * @return {*} the arg or it's first item
 */
function unwrapArray(arg, defaultValue) {
  arg = Array.isArray(arg) ? /* istanbul ignore next (preact) */ arg[0] : arg
  if (!arg && defaultValue) {
    return defaultValue
  } else {
    return arg
  }
}

/**
 * @param {Object} element (P)react element
 * @return {Boolean} whether it's a DOM element
 */
function isDOMElement(element) {
  /* istanbul ignore if */
  if (isPreact) {
    // then this is preact
    return typeof element.nodeName === 'string'
  }

  // then we assume this is react
  return typeof element.type === 'string'
}

/**
 * @param {Object} element (P)react element
 * @return {Object} the props
 */
function getElementProps(element) {
  // props for react, attributes for preact

  /* istanbul ignore if */
  if (isPreact) {
    return element.attributes
  }

  return element.props
}

/**
 * Throws a helpful error message for required properties. Useful
 * to be used as a default in destructuring or object params.
 * @param {String} fnName the function name
 * @param {String} propName the prop name
 */
function requiredProp(fnName, propName) {
  // eslint-disable-next-line no-console
  console.error(`The property "${propName}" is required in "${fnName}"`)
}

const stateKeys = [
  'highlightedIndex',
  'inputValue',
  'isOpen',
  'selectedItem',
  'type',
]
/**
 * @param {Object} state the state object
 * @return {Object} state that is relevant to downshift
 */
function pickState(state = {}) {
  const result = {}
  stateKeys.forEach(k => {
    if (state.hasOwnProperty(k)) {
      result[k] = state[k]
    }
  })
  return result
}

/**
 * Normalizes the 'key' property of a KeyboardEvent in IE/Edge
 * @param {Object} event a keyboardEvent object
 * @return {String} keyboard key
 */
function normalizeArrowKey(event) {
  const {key, keyCode} = event
  /* istanbul ignore next (ie) */
  if (keyCode >= 37 && keyCode <= 40 && key.indexOf('Arrow') !== 0) {
    return `Arrow${key}`
  }
  return key
}

/**
 * Simple check if the value passed is object literal
 * @param {*} obj any things
 * @return {Boolean} whether it's object literal
 */
function isPlainObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

export {
  cbToCb,
  callAllEventHandlers,
  callAll,
  debounce,
  scrollIntoView,
  generateId,
  getA11yStatusMessage,
  unwrapArray,
  isDOMElement,
  getElementProps,
  isOrContainsNode,
  noop,
  requiredProp,
  setIdCounter,
  resetIdCounter,
  pickState,
  isPlainObject,
  normalizeArrowKey,
}
