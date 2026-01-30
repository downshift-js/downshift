import {State} from '../../utils-ts'
import {capitalizeString} from './capitalizeString'

export function getDefaultValue<S extends State, P extends Partial<S>>(
  props: P,
  propKey: keyof S,
  defaultStateValues: S,
): S[keyof S] {
  const defaultValue = props[`default${capitalizeString(propKey as string)}`]

  if (defaultValue !== undefined) {
    return defaultValue as S[keyof S]
  }

  return defaultStateValues[propKey]
}
