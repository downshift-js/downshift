/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react'
import {validateControlledUnchanged, noop} from '../../utils'
import {useIsInitialMount} from './useIsInitialMount'

type UseControlPropsValidatorOptions = {
  state: Record<string, any>
  props: Record<string, any>
}

// eslint-disable-next-line import/no-mutable-exports
export let useControlPropsValidator = noop as (
  options: UseControlPropsValidatorOptions,
) => void
/* istanbul ignore next */
if (process.env.NODE_ENV !== 'production') {
  useControlPropsValidator = ({props, state}) => {
    // used for checking when props are moving from controlled to uncontrolled.
    const prevPropsRef = React.useRef(props)
    const isInitialMount = useIsInitialMount()

    React.useEffect(() => {
      if (isInitialMount) {
        return
      }

      validateControlledUnchanged(state, prevPropsRef.current, props)
      prevPropsRef.current = props
    }, [state, props, isInitialMount])
  }
}
