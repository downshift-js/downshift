function proptype() {}
proptype.isRequired = proptype

const PropTypes = {
  element: proptype,
  func: proptype,
  shape: () => proptype,
  instanceOf: () => proptype,
}

export default PropTypes
