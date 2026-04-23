import * as React from 'react'

import {noop} from '../../utils'

type PropCallInfo = {
  suppressRefError: boolean
  refKey: string
  elementRef: React.RefObject<HTMLElement> | undefined
}

/* istanbul ignore next */
// eslint-disable-next-line import/no-mutable-exports
export let useGetterPropsCalledChecker = (() => noop) as (
  ...propKeys: string[]
) => (
  propKey: string,
  suppressRefError: boolean,
  refKey: string,
  elementRef: React.RefObject<HTMLElement> | undefined,
) => void
/**
 * Custom hook that checks if getter props are called correctly.
 *
 * @param propKeys Getter prop names to be handled.
 * @returns Setter function called inside getter props to set call information.
 */
/* istanbul ignore next */
if (process.env.NODE_ENV !== 'production') {
  useGetterPropsCalledChecker = (...propKeys: string[]) => {
    const getterPropsCalledRef = React.useRef<Record<string, PropCallInfo>>(
      propKeys.reduce<Record<string, PropCallInfo>>((acc, propKey) => {
        acc[propKey] = {} as PropCallInfo

        return acc
      }, {}),
    )

    React.useEffect(() => {
      Object.keys(getterPropsCalledRef.current).forEach(propKey => {
        const propCallInfo = getterPropsCalledRef.current[
          propKey
        ] as PropCallInfo

        if (!Object.keys(propCallInfo).length) {
          // eslint-disable-next-line no-console
          console.error(
            `downshift: You forgot to call the ${propKey} getter function on your component / element.`,
          )
          return
        }

        const {suppressRefError, refKey, elementRef} = propCallInfo

        if (suppressRefError) {
          return
        }

        if (!elementRef?.current) {
          // eslint-disable-next-line no-console
          console.error(
            `downshift: The ref prop "${refKey}" from ${propKey} was not applied correctly on your element.`,
          )
        }
      })
    }, [])

    const setGetterPropCallInfo = React.useCallback(
      (
        propKey: string,
        suppressRefError: boolean,
        refKey: string,
        elementRef: React.RefObject<HTMLElement> | undefined,
      ) => {
        getterPropsCalledRef.current[propKey] = {
          suppressRefError,
          refKey,
          elementRef,
        }
      },
      [],
    )

    return setGetterPropCallInfo
  }
}
