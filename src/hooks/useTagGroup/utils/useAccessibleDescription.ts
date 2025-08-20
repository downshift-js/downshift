import * as React from 'react'

export const A11Y_DESCRIPTION_ELEMENT_ID = 'tag-group-a11y-description'

export function useAccessibleDescription(
  document: Document | undefined,
  description: string,
) {
  React.useEffect(() => {
    if (!document) {
      return
    }

    const accessibleDescriptionElement = document.createElement('div')

    accessibleDescriptionElement.setAttribute('id', A11Y_DESCRIPTION_ELEMENT_ID)
    accessibleDescriptionElement.style.display = 'none'
    accessibleDescriptionElement.textContent = description

    document.body.appendChild(accessibleDescriptionElement)

    return () => {
      accessibleDescriptionElement.remove()
    }
  }, [description, document])
}
