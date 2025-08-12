import {Action, Props, State} from '../../utils-ts'
import {capitalizeString} from './capitalizeString'

export function callOnChangeProps<
  S extends State,
  P extends Partial<S> & Props<S, T>,
  T,
>(action: Action<T>, props: P, state: S, newState: S) {
  const {type} = action
  const changes: Partial<State> = {}
  const keys = Object.keys(state)

  for (const key of keys) {
    invokeOnChangeHandler(key, action, props, state, newState)

    if (newState[key] !== state[key]) {
      changes[key] = newState[key]
    }
  }

  if (props.onStateChange && Object.keys(changes).length) {
    props.onStateChange({type, ...changes})
  }
}

function invokeOnChangeHandler<
  S extends State,
  P extends Partial<S> & Props<S, T>,
  T,
>(key: string, action: Action<T>, props: P, state: S, newState: S) {
  if (newState[key] === state[key]) {
    return
  }

  const handlerKey = `on${capitalizeString(key)}Change`
  const handler = props[handlerKey]

  if (typeof handler !== 'function') {
    return
  }

  const {type} = action

  handler({type, ...newState})
}
