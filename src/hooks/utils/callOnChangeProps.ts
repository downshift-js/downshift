import {capitalizeString} from './capitalizeString'

import {Action, Props} from './index.types'

export function callOnChangeProps<
  S extends object,
  A extends {type: string},
  P extends Props<S, A>,
>(action: Action<S, A, P>, props: P, state: S, newState: S) {
  const {type} = action
  const changes: Partial<S> = {}
  const keys = Object.keys(state) as (keyof S)[]

  for (const key of keys) {
    invokeOnChangeHandler(key, action, props, state, newState)

    if (newState[key] !== state[key]) {
      changes[key] = newState[key]
    }
  }

  if (
    typeof props.onStateChange === 'function' &&
    Object.keys(changes).length
  ) {
    props.onStateChange({type, ...changes})
  }
}

function invokeOnChangeHandler<
  S extends object,
  A extends {type: string},
  P extends Props<S, A>,
>(key: keyof S, action: Action<S, A, P>, props: P, state: S, newState: S) {
  if (newState[key] === state[key]) {
    return
  }

  const handlerKey = `on${capitalizeString(key as string)}Change`
  const handler = (props as Record<string, unknown>)[handlerKey]

  if (typeof handler !== 'function') {
    return
  }

  const {type} = action

  handler({type, ...newState})
}
