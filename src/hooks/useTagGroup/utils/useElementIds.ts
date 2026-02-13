import * as React from 'react'

import {generateId} from '../../../utils-ts'

type UseElementIdsProps = {
  id?: string
  tagGroupId?: string
  getTagId?: (index: number) => string
}

type UseElementIdsReturnValue = {
  tagGroupId: string
  getTagId: (index: number) => string
}

// eslint-disable-next-line @typescript-eslint/dot-notation
const reactUseId = React['useId']

// istanbul ignore next
export const useElementIds: (
  props: UseElementIdsProps,
) => UseElementIdsReturnValue =
  typeof reactUseId === 'function' ? useElementIdsR18 : useElementIdsLegacy

function useElementIdsR18({
  id,
  tagGroupId,
  getTagId,
}: UseElementIdsProps): UseElementIdsReturnValue {
  const reactId = `downshift-${reactUseId()}`
  if (!id) {
    id = reactId
  }

  const elementIds = React.useMemo(
    () => ({
      tagGroupId: tagGroupId ?? `${id}-tag-group`,
      getTagId: getTagId ?? (index => `${id}-tag-${index}`),
    }),
    [getTagId, id, tagGroupId],
  )

  return elementIds
}

function useElementIdsLegacy({
  id = `downshift-${generateId()}`,
  getTagId,
  tagGroupId,
}: UseElementIdsProps): UseElementIdsReturnValue {
  const elementIds = React.useMemo(
    () => ({
      tagGroupId: tagGroupId ?? `${id}-tag-group`,
      getTagId: getTagId ?? (index => `${id}-tag-${index}`),
    }),
    [getTagId, id, tagGroupId],
  )

  return elementIds
}
