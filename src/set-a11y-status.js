// istanbul ignore next
let statusDiv =
  typeof document === 'undefined' ?
    null :
    document.getElementById('a11y-status-message')

let statuses = []

function setStatus(status) {
  const isSameAsLast = statuses[statuses.length - 1] === status
  if (isSameAsLast) {
    statuses = [...statuses, status]
  } else {
    statuses = [status]
  }
  const div = getStatusDiv()
  div.innerHTML = `${statuses.filter(Boolean).map(getStatusHtml).join('')}`
}

function getStatusHtml(status, index) {
  const display = index === statuses.length - 1 ? 'block' : 'none'
  return `<div style="display:${display};">${status}</div>`
}

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
