import {isPreact} from '../is.macro'
/**
 * Default implementation for status message. Only added when menu is open.
 * Will specify if there are results in the list, and if so, how many,
 * and what keys are relevant.
 *
 * @param {Object} param the downshift state and other relevant properties
 * @return {String} the a11y status message
 */
function getA11yStatusMessage({isOpen, resultCount, previousResultCount}) {
  if (!isOpen) {
    return ''
  }

  if (!resultCount) {
    return 'No results are available.'
  }

  if (resultCount !== previousResultCount) {
    return `${resultCount} result${
      resultCount === 1 ? ' is' : 's are'
    } available, use up and down arrow keys to navigate. Press Enter key to select.`
  }

  return ''
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
    // then this is preact or preact X
    return (
      typeof element.type === 'string' || typeof element.nodeName === 'string'
    )
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
    return element.props || element.attributes
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
 * This determines whether a prop is a "controlled prop" meaning it is
 * state which is controlled by the outside of this component rather
 * than within this component.
 *
 * @param {Object} props The props that may contain controlled values.
 * @param {String} key the key to check
 * @return {Boolean} whether it is a controlled controlled prop
 */
function isControlledProp(props, key) {
  return props[key] !== undefined
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
  getA11yStatusMessage,
  unwrapArray,
  isDOMElement,
  getElementProps,
  requiredProp,
  pickState,
  isPlainObject,
  normalizeArrowKey,
  isControlledProp,
}
