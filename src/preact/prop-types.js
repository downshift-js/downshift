/*
 * This file is here for preact compatibility
 * so you don't have to ship prop types to preact.
 * This makes the assumption that you are trading
 * off a little nicer developer experience in favor
 * of a smaller build.
 */
function proptype() {}
proptype.isRequired = proptype

const PropTypes = {
  element: proptype,
  func: proptype,
  number: proptype,
  any: proptype,
  bool: proptype,
  string: proptype,
}

export default PropTypes
