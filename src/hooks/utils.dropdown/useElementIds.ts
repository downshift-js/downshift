import * as React from 'react'

import {generateId} from '../../utils-ts'

type UseElementIdsProps = {
  id?: string
  labelId?: string
  menuId?: string
  getItemId?: (index: number) => string
  toggleButtonId?: string
  inputId?: string
}

type UseElementIdsReturnValue = {
  labelId: string
  menuId: string
  getItemId: (index: number) => string
  toggleButtonId: string
  inputId: string
}

// eslint-disable-next-line @typescript-eslint/dot-notation
const reactUseId = React['useId']

export const useElementIds =
  typeof reactUseId === 'function' ? useElementIdsR18 : useElementIdsLegacy

function useElementIdsR18({
  id,
  labelId,
  menuId,
  getItemId,
  toggleButtonId,
  inputId,
}: UseElementIdsProps): UseElementIdsReturnValue {
  const reactId = `downshift-${reactUseId()}`
  if (!id) {
    id = reactId
  }

  const elementIds = React.useMemo(
    () => ({
      labelId: labelId ?? `${id}-label`,
      menuId: menuId ?? `${id}-menu`,
      getItemId: getItemId ?? (index => `${id}-item-${index}`),
      toggleButtonId: toggleButtonId ?? `${id}-toggle-button`,
      inputId: inputId ?? `${id}-input`,
    }),
    [getItemId, id, inputId, labelId, menuId, toggleButtonId],
  )

  return elementIds
}

function useElementIdsLegacy({
  id,
  labelId,
  menuId,
  getItemId,
  toggleButtonId,
  inputId,
}: UseElementIdsProps): UseElementIdsReturnValue {
  const baseIdRef = React.useRef(id ?? `downshift-${generateId()}`)
  const baseId = baseIdRef.current

  const elementIds = React.useMemo(
    () => ({
      labelId: labelId ?? `${baseId}-label`,
      menuId: menuId ?? `${baseId}-menu`,
      getItemId: getItemId ?? (index => `${baseId}-item-${index}`),
      toggleButtonId: toggleButtonId ?? `${baseId}-toggle-button`,
      inputId: inputId ?? `${baseId}-input`,
    }),
    [getItemId, inputId, labelId, menuId, toggleButtonId, baseId],
  )

  return elementIds
}
