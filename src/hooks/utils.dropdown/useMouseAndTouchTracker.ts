import * as React from 'react'

import {isReactNative} from 'src/is.macro'
import {noop, targetWithinDownshift} from 'src/utils'
import {Environment} from 'src/index.types'

/**
 * Tracks mouse and touch events, such as mouseDown, touchMove and touchEnd.
 *
 * @param environment The environment to add the event listeners to, for instance window.
 * @param handleBlur The function that is called if mouseDown or touchEnd occured outside the downshiftElements.
 * @param downshiftRefs The refs for the elements that should not trigger a blur action from mouseDown or touchEnd.
 * 
 * @returns {{isMouseDown: boolean, isTouchMove: boolean, isTouchEnd: boolean}} The mouse and touch events information, if any of are happening.
 */
export function useMouseAndTouchTracker(
  environment: Environment | undefined,
  handleBlur: () => void,
  downshiftRefs: Array<{current: HTMLElement}>,
) {
  const mouseAndTouchTrackersRef = React.useRef({
    isMouseDown: false,
    isTouchMove: false,
    isTouchEnd: false,
  })

  const getDownshiftElements = React.useCallback(
    () => downshiftRefs.map(ref => ref.current),
    [downshiftRefs],
  )

  React.useEffect(() => {
    if (isReactNative || !environment) {
      return noop
    }

    function onMouseDown() {
      mouseAndTouchTrackersRef.current.isTouchEnd = false // reset this one.
      mouseAndTouchTrackersRef.current.isMouseDown = true
    }
    function onMouseUp(event: MouseEvent) {
      mouseAndTouchTrackersRef.current.isMouseDown = false

      if (
        !targetWithinDownshift(
          event.target,
          getDownshiftElements(),
          environment,
        )
      ) {
        handleBlur()
      }
    }
    function onTouchStart() {
      mouseAndTouchTrackersRef.current.isTouchEnd = false
      mouseAndTouchTrackersRef.current.isTouchMove = false
    }
    function onTouchMove() {
      mouseAndTouchTrackersRef.current.isTouchMove = true
    }
    function onTouchEnd(event: TouchEvent) {
      mouseAndTouchTrackersRef.current.isTouchEnd = true

      if (
        !mouseAndTouchTrackersRef.current.isTouchMove &&
        !targetWithinDownshift(
          event.target,
          getDownshiftElements(),
          environment,
          false,
        )
      ) {
        handleBlur()
      }
    }

    environment.addEventListener('mousedown', onMouseDown)
    environment.addEventListener('mouseup', onMouseUp)
    environment.addEventListener('touchstart', onTouchStart)
    environment.addEventListener('touchmove', onTouchMove)
    environment.addEventListener('touchend', onTouchEnd)

    return function cleanup() {
      environment.removeEventListener('mousedown', onMouseDown)
      environment.removeEventListener('mouseup', onMouseUp)
      environment.removeEventListener('touchstart', onTouchStart)
      environment.removeEventListener('touchmove', onTouchMove)
      environment.removeEventListener('touchend', onTouchEnd)
    }
  }, [environment, getDownshiftElements, handleBlur])

  return mouseAndTouchTrackersRef.current
}
