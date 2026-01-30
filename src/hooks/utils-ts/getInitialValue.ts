import {State} from '../../utils-ts'
import {capitalizeString} from './capitalizeString'
import {getDefaultValue} from './getDefaultValue'

export function getInitialValue<S extends State, P extends Partial<S>>(
  props: P,
  propKey: keyof S,
  defaultStateValues: S,
): S[keyof S] {
  const value = props[propKey] as keyof S | undefined

  if (value !== undefined) {
    return value as S[keyof S]
  }

  const initialValue = props[`initial${capitalizeString(propKey as string)}`]

  if (initialValue !== undefined) {
    return initialValue as S[keyof S]
  }

  return getDefaultValue(props, propKey, defaultStateValues)
}
