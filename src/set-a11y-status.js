import {debounce} from './utils'

const cleanupStatus = debounce(documentProp => {
  getStatusDiv(documentProp).textContent = ''
}, 500)

/**
 * Get the status node or create it if it does not already exist.
 * @param {Object} documentProp document passed by the user.
 * @return {HTMLElement} the status node.
 */
function getStatusDiv(documentProp) {
  let statusDiv = documentProp.getElementById('a11y-status-message')
  if (statusDiv) {
    return statusDiv
  }

  statusDiv = documentProp.createElement('div')
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
  documentProp.body.appendChild(statusDiv)
  return statusDiv
}

/**
 * @param {String} status the status message
 * @param {Object} documentProp document passed by the user.
 */
export default function setStatus(status, documentProp) {
  if (!status || !documentProp) {
    return
  }

  const div = getStatusDiv(documentProp)

  div.textContent = status
  cleanupStatus(documentProp)
}
