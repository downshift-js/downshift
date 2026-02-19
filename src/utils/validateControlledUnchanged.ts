import {noop} from './noop'

type ValidateControlledUnchanged = (
  state: Record<string, unknown>,
  prevProps: Record<string, unknown>,
  nextProps: Record<string, unknown>,
) => void

// eslint-disable-next-line import/no-mutable-exports
let validateControlledUnchanged: ValidateControlledUnchanged = noop
/* istanbul ignore next */
if (process.env.NODE_ENV !== 'production') {
  validateControlledUnchanged = (state, prevProps, nextProps) => {
    const warningDescription = `This prop should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled Downshift element for the lifetime of the component. More info: https://github.com/downshift-js/downshift#control-props`

    Object.keys(state).forEach(propKey => {
      if (
        prevProps[propKey] !== undefined &&
        nextProps[propKey] === undefined
      ) {
        // eslint-disable-next-line no-console
        console.error(
          `downshift: A component has changed the controlled prop "${propKey}" to be uncontrolled. ${warningDescription}`,
        )
      } else if (
        prevProps[propKey] === undefined &&
        nextProps[propKey] !== undefined
      ) {
        // eslint-disable-next-line no-console
        console.error(
          `downshift: A component has changed the uncontrolled prop "${propKey}" to be controlled. ${warningDescription}`,
        )
      }
    })
  }
}

export {validateControlledUnchanged}
