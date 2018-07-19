// istanbul ignore next
let statusDiv =
  typeof document === 'undefined'
    ? null
    : document.getElementById('a11y-status-message')

let statuses = []

/**
 * @param {String} status the status message
 */
function setStatus(status) {
  const isSameAsLast = statuses[statuses.length - 1] === status
  if (isSameAsLast) {
    statuses = [...statuses, status]
  } else {
    statuses = [status]
  }
  const div = getStatusDiv()

  // Remove previous children
  while (div.lastChild) {
    div.removeChild(div.firstChild)
  }

  statuses.filter(Boolean).forEach((statusItem, index) => {
    div.appendChild(getStatusChildDiv(statusItem, index))
  })
}

/**
 * @param {String} status the status message
 * @param {Number} index the index
 * @return {HTMLElement} the child node
 */
function getStatusChildDiv(status, index) {
  const display = index === statuses.length - 1 ? 'block' : 'none'

  const childDiv = document.createElement('div')
  childDiv.style.display = display
  childDiv.textContent = status

  return childDiv
}

/**
 * Get the status node or create it if it does not already exist
 * @return {HTMLElement} the status node
 */
function getStatusDiv() {
  if (statusDiv) {
    return statusDiv
  }
  statusDiv = document.createElement('div')
  statusDiv.setAttribute('id', 'a11y-status-message')
  statusDiv.setAttribute('role', 'status')
  statusDiv.setAttribute('aria-live', 'assertive')
  statusDiv.setAttribute('aria-relevant', 'additions text')
  Object.assign(statusDiv.style, {
    border: '0',
    clip: 'rect(0 0 0 0)',
    height: '1px',
    margin: '-1px',
    overflow: 'hidden',
    padding: '0',
    position: 'absolute',
    width: '1px',
  })
  document.body.appendChild(statusDiv)
  return statusDiv
}

export default setStatus
