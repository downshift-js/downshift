import {compute} from 'compute-scroll-into-view'
import {isPreact} from './is.macro'

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
 * @param {HTMLElement} menuNode the menu element of the component
 */
function scrollIntoView(node, menuNode) {
  if (!node) {
    return
  }

  const actions = compute(node, {
    boundary: menuNode,
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
 * @param {Window} environment The window context where downshift renders.
 * @return {Boolean} whether the parent is the child or the child is in the parent
 */
function isOrContainsNode(parent, child, environment) {
  const result =
    parent === child ||
    (child instanceof environment.Node &&
      parent.contains &&
      parent.contains(child))
  return result
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

function handleRefs(...refs) {
  return node => {
    refs.forEach(ref => {
      if (typeof ref === 'function') {
        ref(node)
      } else if (ref) {
        ref.current = node
      }
    })
  }
}

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
 * This will perform a shallow merge of the given state object
 * with the state coming from props
 * (for the controlled component scenario)
 * This is used in state updater functions so they're referencing
 * the right state regardless of where it comes from.
 *
 * @param {Object} state The state of the component/hook.
 * @param {Object} props The props that may contain controlled values.
 * @returns {Object} The merged controlled state.
 */
function getState(state, props) {
  if (!state || !props) {
    return state
  }

  return Object.keys(state).reduce((prevState, key) => {
    prevState[key] = isControlledProp(props, key) ? props[key] : state[key]

    return prevState
  }, {})
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

/**
 * Returns the next non-disabled highlightedIndex value.
 *
 * @param {number} start The current highlightedIndex.
 * @param {number} offset The offset from the current highlightedIndex to start searching.
 * @param {unknown[]} items The items array.
 * @param {(item: unknown, index: number) => boolean} isItemDisabled Function that tells if an item is disabled or not.
 * @param {boolean?} circular If the search reaches the end, if it can search again starting from the other end.
 * @returns {number} The next highlightedIndex.
 */
function getHighlightedIndex(
  start,
  offset,
  items,
  isItemDisabled,
  circular = false,
) {
  const count = items.length
  if (count === 0) {
    return -1
  }

  const itemsLastIndex = count - 1

  if (typeof start !== 'number' || start < 0 || start > itemsLastIndex) {
    start = offset > 0 ? -1 : itemsLastIndex + 1
  }

  let current = start + offset

  if (current < 0) {
    current = circular ? itemsLastIndex : 0
  } else if (current > itemsLastIndex) {
    current = circular ? 0 : itemsLastIndex
  }

  const highlightedIndex = getNonDisabledIndex(
    current,
    offset < 0,
    items,
    isItemDisabled,
    circular,
  )

  if (highlightedIndex === -1) {
    return start >= count ? -1 : start
  }

  return highlightedIndex
}

/**
 * Returns the next non-disabled highlightedIndex value.
 *
 * @param {number} start The current highlightedIndex.
 * @param {boolean} backwards If true, it will search backwards from the start.
 * @param {unknown[]} items The items array.
 * @param {(item: unknown, index: number) => boolean} isItemDisabled Function that tells if an item is disabled or not.
 * @param {boolean} circular If the search reaches the end, if it can search again starting from the other end.
 * @returns {number} The next non-disabled index.
 */
function getNonDisabledIndex(
  start,
  backwards,
  items,
  isItemDisabled,
  circular = false,
) {
  const count = items.length

  if (backwards) {
    for (let index = start; index >= 0; index--) {
      if (!isItemDisabled(items[index], index)) {
        return index
      }
    }
  } else {
    for (let index = start; index < count; index++) {
      if (!isItemDisabled(items[index], index)) {
        return index
      }
    }
  }

  if (circular) {
    return getNonDisabledIndex(
      backwards ? count - 1 : 0,
      backwards,
      items,
      isItemDisabled,
    )
  }

  return -1
}

/**
 * Checks if event target is within the downshift elements.
 *
 * @param {EventTarget} target Target to check.
 * @param {HTMLElement[]} downshiftElements The elements that form downshift (list, toggle button etc).
 * @param {Window} environment The window context where downshift renders.
 * @param {boolean} checkActiveElement Whether to also check activeElement.
 *
 * @returns {boolean} Whether or not the target is within downshift elements.
 */
function targetWithinDownshift(
  target,
  downshiftElements,
  environment,
  checkActiveElement = true,
) {
  return (
    environment &&
    downshiftElements.some(
      contextNode =>
        contextNode &&
        (isOrContainsNode(contextNode, target, environment) ||
          (checkActiveElement &&
            isOrContainsNode(
              contextNode,
              environment.document.activeElement,
              environment,
            ))),
    )
  )
}

// eslint-disable-next-line import/no-mutable-exports
let validateControlledUnchanged = noop
/* istanbul ignore next */
if (process.env.NODE_ENV !== 'production') {
  validateControlledUnchanged = (state, prevProps, nextProps) => {
    const warningDescription = `This prop should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled Downshift element for the lifetime of the component. More info: https://github.com/downshift-js/downshift#control-props`

    Object.keys(state).forEach(propKey => {
      if (
        prevProps[propKey] !== undefined &&
        nextProps[propKey] === undefined
      ) {
        // eslint-disable-next-line no-console
        console.error(
          `downshift: A component has changed the controlled prop "${propKey}" to be uncontrolled. ${warningDescription}`,
        )
      } else if (
        prevProps[propKey] === undefined &&
        nextProps[propKey] !== undefined
      ) {
        // eslint-disable-next-line no-console
        console.error(
          `downshift: A component has changed the uncontrolled prop "${propKey}" to be controlled. ${warningDescription}`,
        )
      }
    })
  }
}

export {
  cbToCb,
  callAllEventHandlers,
  handleRefs,
  debounce,
  scrollIntoView,
  getA11yStatusMessage,
  unwrapArray,
  isDOMElement,
  getElementProps,
  noop,
  requiredProp,
  pickState,
  isPlainObject,
  normalizeArrowKey,
  targetWithinDownshift,
  getState,
  isControlledProp,
  validateControlledUnchanged,
  getHighlightedIndex,
  getNonDisabledIndex,
}
