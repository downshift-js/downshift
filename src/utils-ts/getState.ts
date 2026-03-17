/**
 * This will perform a shallow merge of the given state object
 * with the state coming from props
 * (for the controlled component scenario)
 * This is used in state updater functions so they're referencing
 * the right state regardless of where it comes from.
 *
 * @param state The state of the component/hook.
 * @param props The props that may contain controlled values.
 * @returns The merged controlled state.
 */
export function getState<S extends object>(state: S, props?: Partial<S>): S {
  if (!props) {
    return state
  }

  const keys = Object.keys(state) as (keyof S)[]

  return keys.reduce(
    (newState, key) => {
      // state keys could be in props, but with value undefined, which means they should be ignored.
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (props[key] !== undefined) {
        newState[key] = props[key] as S[typeof key]
      }
      return newState
    },
    {...state},
  )
}
