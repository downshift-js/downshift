import * as React from 'react'
import PropTypes from 'prop-types'

import {generateId} from '../../utils-ts'
import {noop} from '../../utils'
import {
  Action,
  Props,
  State,
  UseElementIdsProps,
  UseElementIdsReturnValue,
} from './utils.types'
import {UseTagGroupProps} from './index.types'

const propTypes = {
  isItemDisabled: PropTypes.func,
}

export const defaultProps: Pick<UseTagGroupProps, 'stateReducer'> = {
  stateReducer(_s, {changes}) {
    return changes
  },
}

// eslint-disable-next-line import/no-mutable-exports
export let validatePropTypes = noop as (
  options: unknown,
  caller: Function,
) => void
/* istanbul ignore next */
if (process.env.NODE_ENV !== 'production') {
  validatePropTypes = (options: unknown, caller: Function): void => {
    PropTypes.checkPropTypes(propTypes, options, 'prop', caller.name)
  }
}

// istanbul ignore next
export const useElementIds: (
  props: UseElementIdsProps,
) => UseElementIdsReturnValue =
  'useId' in React // Avoid conditional useId call
    ? useElementIdsR18
    : useElementIdsLegacy

function useElementIdsR18({
  id,
  groupId,
  getItemId,
}: UseElementIdsProps): UseElementIdsReturnValue {
  // Avoid conditional useId call
  const reactId = `downshift-${React.useId()}`
  if (!id) {
    id = reactId
  }

  const elementIdsRef = React.useRef({
    groupId: groupId ?? `${id}-tag-group`,
    getItemId: getItemId ?? (index => `${id}-item-${index}`),
  })

  return elementIdsRef.current
}

function useElementIdsLegacy({
  id = `downshift-${generateId()}`,
  getItemId,
  groupId,
}: UseElementIdsProps): UseElementIdsReturnValue {
  const elementIdsRef = React.useRef({
    groupId: groupId ?? `${id}-menu`,
    getItemId: getItemId ?? (index => `${id}-item-${index}`),
  })

  return elementIdsRef.current
}

// probably to move

export function getState<
  S extends State,
  P extends Partial<S> & Props<S, T>,
  T,
>(state: S, props?: P): S {
  if (!props) {
    return state
  }

  const keys = Object.keys(state) as (keyof S)[]

  return keys.reduce(
    (newState, key) => {
      if (props[key] !== undefined) {
        newState[key] = props[key] as S[typeof key]
      }
      return newState
    },
    {...state},
  )
}

/**
 * Wraps the useEnhancedReducer and applies the controlled prop values before
 * returning the new state.
 *
 * @param {Function} reducer Reducer function from downshift.
 * @param {Object} props The hook props, also passed to createInitialState.
 * @param {Function} createInitialState Function that returns the initial state.
 * @param {Function} isStateEqual Function that checks if a previous state is equal to the next.
 * @returns {Array} An array with the state and an action dispatcher.
 */
export function useControlledReducer<
  S extends State,
  P extends Partial<S> & Props<S, T>,
  T,
  A extends Action<T>
>(
  reducer: (state: S, action: A) => S,
  props: P,
  createInitialState: (props: P) => S,
  isStateEqual: (prevState: S, newState: S) => boolean,
): [S, (action: A) => void] {
  const [state, dispatch] = useEnhancedReducer(
    reducer,
    props,
    createInitialState,
    isStateEqual,
  )

  return [getState(state, props), dispatch]
}

/**
 * Computes the controlled state using a the previous state, props,
 * two reducers, one from downshift and an optional one from the user.
 * Also calls the onChange handlers for state values that have changed.
 *
 * @param {Function} reducer Reducer function from downshift.
 * @param {Object} props The hook props, also passed to createInitialState.
 * @param {Function} createInitialState Function that returns the initial state.
 * @param {Function} isStateEqual Function that checks if a previous state is equal to the next.
 * @returns {Array} An array with the state and an action dispatcher.
 */
export function useEnhancedReducer<
  S extends State,
  P extends Partial<S> & Props<S, T>,
  T,
    A extends Action<T>
>(
  reducer: (state: S, action: A) => S,
  props: P,
  createInitialState: (props: P) => S,
  isStateEqual: (prevState: S, newState: S) => boolean,
): [S, (action: A) => void] {
  const prevStateRef = React.useRef<S | null>(null)
  const actionRef = React.useRef<A>()
  const propsRef = useLatestRef(props)

  const enhancedReducer = React.useCallback(
    (state: S, action: A): S => {
      actionRef.current = action
      state = getState(state, propsRef.current)

      const changes = reducer(state, action)
      const newState = propsRef.current.stateReducer(state, {
        ...action,
        changes,
      })

      return {...state, ...newState}
    },
    [propsRef, reducer],
  )
  const [state, dispatch] = React.useReducer(
    enhancedReducer,
    props,
    createInitialState,
  )

  const action = actionRef.current

  React.useEffect(() => {
    const prevState = getState(
      prevStateRef.current ?? ({} as S),
      propsRef.current,
    )
    const shouldCallOnChangeProps =
      action && prevStateRef.current && !isStateEqual(prevState, state)

    if (shouldCallOnChangeProps) {
      callOnChangeProps(action, propsRef.current, prevState, state)
    }

    prevStateRef.current = state
  }, [state, action, isStateEqual, propsRef])

  return [getState(state, props), dispatch]
}

function useLatestRef<T>(val: T) {
  const ref = React.useRef<T>(val)
  // technically this is not "concurrent mode safe" because we're manipulating
  // the value during render (so it's not idempotent). However, the places this
  // hook is used is to support memoizing callbacks which will be called
  // *during* render, so we need the latest values *during* render.
  // If not for this, then we'd probably want to use useLayoutEffect instead.
  ref.current = val
  return ref
}

function callOnChangeProps<
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
>(
  key: string,
  action: Action<T>,
  props: P,
  state: S,
  newState: S,
) {
  const {type} = action
  const handlerKey = `on${capitalizeString(key)}Change`

  if (typeof props[handlerKey] === 'function' && newState[key] !== state[key]) {
    props[handlerKey]({type, ...newState})
  }
}

function capitalizeString(string: string): string {
  return `${string.slice(0, 1).toUpperCase()}${string.slice(1)}`
}

// export function getState<S extends State, P extends Props<S, T> | undefined, T>(
//   state: S,
//   props: P,
// ): S {
//   if (!props) {
//     return state
//   }

//   const keys = Object.keys(state) as Array<keyof S>

//   return keys.reduce(
//     (newState, key) => {
//       // if (props[key] !== undefined) {
//       //   newState[key] = props[key]
//       // }
//       if (key in props) {
//         newState[key] = props[key]
//       }

//       return newState
//     },
//     {...state},
//   )
// }

// /**
//  * Computes the controlled state using a the previous state, props,
//  * two reducers, one from downshift and an optional one from the user.
//  * Also calls the onChange handlers for state values that have changed.
//  *
//  * @param {Function} reducer Reducer function from downshift.
//  * @param {Object} props The hook props, also passed to createInitialState.
//  * @param {Function} createInitialState Function that returns the initial state.
//  * @param {Function} isStateEqual Function that checks if a previous state is equal to the next.
//  * @returns {Array} An array with the state and an action dispatcher.
//  */
// export function useEnhancedReducer<S extends State, P extends Props<S, T>, T>(
//   reducer: (state: S, action: Action<T>) => S,
//   props: P,
//   createInitialState: (props: P) => S,
//   isStateEqual: (prevState: S, newState: S) => boolean,
// ) {
//   const prevStateRef = React.useRef<S>(null)
//   const actionRef = React.useRef<ActionWithProps<P, T>>()
//   const enhancedReducer = React.useCallback(
//     (state: S, action: ActionWithProps<P, T>) => {
//       actionRef.current = action
//       state = getState(state, action.props)

//       const changes = reducer(state, action)
//       const newState = action.props.stateReducer(state, {...action, changes})

//       return newState
//     },
//     [reducer],
//   )
//   const [state, dispatch] = React.useReducer(
//     enhancedReducer,
//     props,
//     createInitialState,
//   )
//   const propsRef = useLatestRef(props)
//   const dispatchWithProps = React.useCallback(
//     (action: Action<T>) => dispatch({props: propsRef.current, ...action}),
//     [propsRef],
//   )
//   const action = actionRef.current

//   React.useEffect(() => {
//     const prevState = getState(prevStateRef.current ?? ({} as S), action?.props)
//     const shouldCallOnChangeProps =
//       action && prevStateRef.current && !isStateEqual(prevState, state)

//     if (shouldCallOnChangeProps) {
//       callOnChangeProps(action, prevState, state)
//     }

//     prevStateRef.current = state
//   }, [state, action, isStateEqual])

//   return [getState(state, props), dispatchWithProps]
// }

// function useLatestRef<T>(val: T) {
//   const ref = React.useRef<T>(val)
//   // technically this is not "concurrent mode safe" because we're manipulating
//   // the value during render (so it's not idempotent). However, the places this
//   // hook is used is to support memoizing callbacks which will be called
//   // *during* render, so we need the latest values *during* render.
//   // If not for this, then we'd probably want to use useLayoutEffect instead.
//   ref.current = val
//   return ref
// }

// function callOnChangeProps<S extends object, P extends Props<S, T>, T>(
//   action: ActionWithProps<P, T>,
//   state: S,
//   newState: S,
// ) {
//   const {props, type} = action
//   const changes: Partial<S> = {}
//   const keys = Object.keys(state) as Array<Extract<keyof S, string>>

//   for (const key of keys) {
//     invokeOnChangeHandler(key, action, state, newState)

//     if (newState[key] !== state[key]) {
//       changes[key] = newState[key]
//     }
//   }

//   if (props.onStateChange && Object.keys(changes).length) {
//     props.onStateChange({type, ...changes})
//   }
// }

// function invokeOnChangeHandler<S, P, T>(
//   key: Extract<keyof S, string>,
//   action: ActionWithProps<P, T>,
//   state: S,
//   newState: S,
// ) {
//   const {props, type} = action
//   const handlerKey = `on${capitalizeString(key)}Change` as keyof P

//   if (typeof props[handlerKey] === 'function' && newState[key] !== state[key]) {
//     props[handlerKey]({type, ...newState})
//   }
// }

// function capitalizeString(string: string): string {
//   return `${string.slice(0, 1).toUpperCase()}${string.slice(1)}`
// }
