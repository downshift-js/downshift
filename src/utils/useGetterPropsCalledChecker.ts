import * as React from 'react'

import {noop} from './noop'

type SetGetterPropCallInfo = (
  propKey: string,
  suppressRefError: boolean,
  refKey: string,
  elementRef: React.RefObject<unknown>,
) => void

type GetterPropCallInfo = {
  suppressRefError: boolean
  refKey: string
  elementRef: React.RefObject<unknown>
}

type GetterPropsCalledInfo = {
  [propKey: string]: GetterPropCallInfo
}

/* istanbul ignore next */
// eslint-disable-next-line import/no-mutable-exports
let useGetterPropsCalledChecker: (
  ...propKeys: string[]
) => SetGetterPropCallInfo = () => noop
/**
 * Custom hook that checks if getter props are called correctly.
 *
 * @param  {...any} propKeys Getter prop names to be handled.
 * @returns {Function} Setter function called inside getter props to set call information.
 */
/* istanbul ignore next */
if (process.env.NODE_ENV !== 'production') {
  useGetterPropsCalledChecker = (
    ...propKeys: string[]
  ): SetGetterPropCallInfo => {
    const getterPropsCalledRef = React.useRef<GetterPropsCalledInfo>(
      propKeys.reduce<GetterPropsCalledInfo>((acc, propKey) => {
        acc[propKey] = {} as GetterPropCallInfo

        return acc
      }, {}),
    )

    React.useEffect(() => {
      Object.keys(getterPropsCalledRef.current).forEach(propKey => {
        const propCallInfo = getterPropsCalledRef.current[propKey]

        if (!propCallInfo || !Object.keys(propCallInfo).length) {
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

        if (!elementRef.current) {
          // eslint-disable-next-line no-console
          console.error(
            `downshift: The ref prop "${refKey}" from ${propKey} was not applied correctly on your element.`,
          )
        }
      })
    }, [])

    const setGetterPropCallInfo = React.useCallback<SetGetterPropCallInfo>(
      (propKey, suppressRefError, refKey, elementRef) => {
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

export {useGetterPropsCalledChecker}
