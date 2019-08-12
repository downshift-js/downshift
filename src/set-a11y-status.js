import {debounce} from './utils'

// istanbul ignore next
let statusDiv =
  typeof document === 'undefined'
    ? null
    : document.getElementById('a11y-status-message')

const cleanupStatus = debounce(() => {
  getStatusDiv().textContent = ''
}, 500)

/**
 * @param {String} status the status message
 */
function setStatus(status) {
  const div = getStatusDiv()
  if (!status) {
    return
  }

  div.textContent = status
  cleanupStatus()
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
  statusDiv.setAttribute('aria-live', 'polite')
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
