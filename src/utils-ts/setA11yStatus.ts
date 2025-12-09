import {debounce} from './debounce'

const cleanupStatus = debounce((document: Document) => {
  getStatusDiv(document).textContent = ''
}, 500)

/**
 * Get the status node or create it if it does not already exist.
 */
function getStatusDiv(document: Document) {
  let statusDiv = document.getElementById('a11y-status-message')
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

/**
 * Sets aria live status to a div element that's visually hidden.
 */
export function setStatus(status: string, document: Document | undefined) {
  if (!status || !document) {
    return
  }

  const div = getStatusDiv(document)

  div.textContent = status
  cleanupStatus(document)
}

/**
 * Removes the status element from the DOM
 */
export function cleanupStatusDiv(document: Document | undefined) {
  const statusDiv = document?.getElementById('a11y-status-message')

  if (statusDiv) {
    statusDiv.remove()
  }
}
