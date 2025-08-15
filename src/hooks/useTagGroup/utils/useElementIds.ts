import * as React from 'react'

import {generateId} from '../../../utils-ts'
import {UseElementIdsProps, UseElementIdsReturnValue} from '.'

// istanbul ignore next
export const useElementIds: (
  props: UseElementIdsProps,
) => UseElementIdsReturnValue =
  'useId' in React // Avoid conditional useId call
    ? useElementIdsR18
    : useElementIdsLegacy

function useElementIdsR18({
  id,
  tagGroupId,
  getTagId,
}: UseElementIdsProps): UseElementIdsReturnValue {
  // Avoid conditional useId call
  const reactId = `downshift-${React.useId()}`
  if (!id) {
    id = reactId
  }

  const elementIdsRef = React.useRef({
    tagGroupId: tagGroupId ?? `${id}-tag-group`,
    getTagId: getTagId ?? (index => `${id}-tag-${index}`),
  })

  return elementIdsRef.current
}

function useElementIdsLegacy({
  id = `downshift-${generateId()}`,
  getTagId,
  tagGroupId,
}: UseElementIdsProps): UseElementIdsReturnValue {
  const elementIdsRef = React.useRef({
    tagGroupId: tagGroupId ?? `${id}-tag-group`,
    getTagId: getTagId ?? (index => `${id}-tag-${index}`),
  })

  return elementIdsRef.current
}
