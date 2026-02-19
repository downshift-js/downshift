import * as React from 'react'

import {noop, validateControlledUnchanged} from 'src/utils'
import {useIsInitialMount} from './useIsInitialMount'

type UseControlPropsValidator = (options: {
  props: Record<string, unknown>
  state: Record<string, unknown>
}) => void

// eslint-disable-next-line import/no-mutable-exports
let useControlPropsValidator: UseControlPropsValidator = noop
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

export {useControlPropsValidator}
